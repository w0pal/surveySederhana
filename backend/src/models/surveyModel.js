const db = require('../database/connection');
const { v4: uuidv4 } = require('uuid');

class SurveyModel {
    // Create new survey response
    static createResponse(data = {}) {
        const id = uuidv4();
        const stmt = db.prepare(`
      INSERT INTO survey_responses (id, whatsapp_number, ip_address, user_agent)
      VALUES (?, ?, ?, ?)
    `);
        stmt.run(id, data.whatsapp_number || null, data.ip_address || null, data.user_agent || null);
        return { id };
    }

    // Save answers for a response
    static saveAnswers(responseId, answers) {
        const insertStmt = db.prepare(`
      INSERT INTO survey_answers (response_id, question_id, answer_value, answer_text)
      VALUES (?, ?, ?, ?)
    `);

        const deleteStmt = db.prepare(`
      DELETE FROM survey_answers WHERE response_id = ? AND question_id = ?
    `);

        const transaction = db.transaction((answers) => {
            for (const answer of answers) {
                // Delete existing answer for this question (for updates)
                deleteStmt.run(responseId, answer.question_id);
                // Insert new answer
                insertStmt.run(
                    responseId,
                    answer.question_id,
                    answer.answer_value || null,
                    answer.answer_text || null
                );
            }
        });

        transaction(answers);
        return { success: true };
    }

    // Mark response as complete
    static completeResponse(responseId, whatsappNumber) {
        const stmt = db.prepare(`
      UPDATE survey_responses 
      SET is_complete = 1, whatsapp_number = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
        stmt.run(whatsappNumber, responseId);
        return { success: true };
    }

    // Get all responses (for admin)
    static getAllResponses(page = 1, limit = 20, filters = {}) {
        const offset = (page - 1) * limit;

        let whereClause = 'WHERE 1=1';
        const params = [];

        if (filters.is_complete !== undefined) {
            whereClause += ' AND is_complete = ?';
            params.push(filters.is_complete);
        }

        if (filters.start_date) {
            whereClause += ' AND created_at >= ?';
            params.push(filters.start_date);
        }

        if (filters.end_date) {
            whereClause += ' AND created_at <= ?';
            params.push(filters.end_date);
        }

        const countStmt = db.prepare(`
      SELECT COUNT(*) as total FROM survey_responses ${whereClause}
    `);
        const { total } = countStmt.get(...params);

        const stmt = db.prepare(`
      SELECT * FROM survey_responses 
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `);

        const responses = stmt.all(...params, limit, offset);

        return {
            data: responses,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    }

    // Get single response with all answers
    static getResponseById(responseId) {
        const responseStmt = db.prepare('SELECT * FROM survey_responses WHERE id = ?');
        const response = responseStmt.get(responseId);

        if (!response) {
            return null;
        }

        const answersStmt = db.prepare(`
      SELECT question_id, answer_value, answer_text 
      FROM survey_answers 
      WHERE response_id = ?
    `);
        const answers = answersStmt.all(responseId);

        return {
            ...response,
            answers: answers.reduce((acc, curr) => {
                acc[curr.question_id] = {
                    value: curr.answer_value,
                    text: curr.answer_text
                };
                return acc;
            }, {})
        };
    }

    // Delete response
    static deleteResponse(responseId) {
        const stmt = db.prepare('DELETE FROM survey_responses WHERE id = ?');
        const result = stmt.run(responseId);
        return { deleted: result.changes > 0 };
    }

    // Get statistics
    static getStatistics() {
        const stats = {};

        // Total responses
        stats.totalResponses = db.prepare('SELECT COUNT(*) as count FROM survey_responses').get().count;
        stats.completedResponses = db.prepare('SELECT COUNT(*) as count FROM survey_responses WHERE is_complete = 1').get().count;

        // Responses by date
        stats.responsesByDate = db.prepare(`
      SELECT DATE(created_at) as date, COUNT(*) as count 
      FROM survey_responses 
      WHERE is_complete = 1
      GROUP BY DATE(created_at) 
      ORDER BY date DESC 
      LIMIT 30
    `).all();

        // Get answer distribution for key questions
        const getAnswerDistribution = (questionId) => {
            return db.prepare(`
        SELECT answer_value, answer_text, COUNT(*) as count
        FROM survey_answers sa
        JOIN survey_responses sr ON sa.response_id = sr.id
        WHERE sa.question_id = ? AND sr.is_complete = 1
        GROUP BY answer_value
        ORDER BY count DESC
      `).all(questionId);
        };

        stats.ageDistribution = getAnswerDistribution('q1_age');
        stats.genderDistribution = getAnswerDistribution('q2_gender');
        stats.travelPlanDistribution = getAnswerDistribution('q7_travel_plan');
        stats.transportationDistribution = getAnswerDistribution('q17_transportation');
        stats.provinceDistribution = getAnswerDistribution('q6_province');
        stats.destinationDistribution = getAnswerDistribution('q11_destination_province');

        return stats;
    }

    // Export all data (including incomplete responses for data cleaning)
    static exportAllData() {
        const responses = db.prepare(`
      SELECT * FROM survey_responses ORDER BY created_at DESC
    `).all();

        const answersStmt = db.prepare(`
      SELECT question_id, answer_value, answer_text 
      FROM survey_answers 
      WHERE response_id = ?
    `);

        return responses.map(response => {
            const answers = answersStmt.all(response.id);
            return {
                ...response,
                answers: answers.reduce((acc, curr) => {
                    acc[curr.question_id] = curr.answer_value || curr.answer_text;
                    return acc;
                }, {})
            };
        });
    }
}

module.exports = SurveyModel;

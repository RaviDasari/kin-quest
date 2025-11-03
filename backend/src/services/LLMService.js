const OpenAI = require('openai');

class LLMService {
  constructor() {
    this.client = null;
    this.model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
  }

  /**
   * Initialize OpenAI client
   */
  initialize() {
    if (!process.env.OPENAI_API_KEY) {
      console.warn('OPENAI_API_KEY not set - LLM filtering will be disabled');
      return;
    }
    
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    console.log(`LLM Service initialized with model: ${this.model}`);
  }

  /**
   * Calculate age from date of birth
   * @param {Date} dob - Date of birth
   * @returns {number} Age in years
   */
  calculateAge(dob) {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  /**
   * Filter and rank events based on family profile
   * @param {Array} events - Array of event objects
   * @param {Array} familyMembers - Array of family member objects with DOB and gender
   * @returns {Promise<Array>} Filtered and ranked events (max 10)
   */
  async filterAndRankEvents(events, familyMembers) {
    // If OpenAI is not configured, return events sorted by date
    if (!this.client) {
      console.warn('OpenAI not configured - returning events without LLM filtering');
      return events
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 10);
    }

    try {
      // Prepare family profile
      const familyProfile = familyMembers.map(member => {
        const age = this.calculateAge(member.dob);
        return {
          age,
          gender: member.gender || 'Not specified',
        };
      });

      // Prepare events for LLM
      const eventsForLLM = events.map((event, idx) => ({
        id: idx,
        title: event.title,
        date: event.date,
        description: event.description,
        ageHints: event.ageHints,
        genderHints: event.genderHints,
      }));

      const prompt = this.buildPrompt(familyProfile, eventsForLLM);

      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that filters and ranks family events based on family demographics. Return only valid JSON.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      const content = response.choices[0].message.content.trim();
      
      // Parse the response
      let rankedIds;
      try {
        const parsed = JSON.parse(content);
        rankedIds = parsed.rankedEventIds || parsed.events || [];
      } catch (parseError) {
        console.error('Error parsing LLM response:', parseError);
        // Fallback to date sorting
        rankedIds = Array.from({length: Math.min(events.length, 10)}, (_, i) => i);
      }

      // Map IDs back to events and add reasoning
      const rankedEvents = rankedIds
        .slice(0, 10)
        .map(id => {
          const event = events[id];
          if (event) {
            return {
              ...event,
              llmRationale: this.generateRationale(event, familyProfile),
            };
          }
          return null;
        })
        .filter(event => event !== null);

      console.log(`LLM filtered ${events.length} events to ${rankedEvents.length} events`);
      return rankedEvents;
    } catch (error) {
      console.error('Error in LLM filtering:', error.message);
      // Fallback to date sorting
      return events
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 10);
    }
  }

  /**
   * Build prompt for LLM
   * @param {Array} familyProfile - Family members with ages and genders
   * @param {Array} events - Events to filter
   * @returns {string} Prompt for LLM
   */
  buildPrompt(familyProfile, events) {
    const familyDesc = familyProfile
      .map(member => `${member.age} years old (${member.gender})`)
      .join(', ');

    return `You are helping a family find suitable local events. 

Family Profile: ${familyDesc}

Available Events:
${JSON.stringify(events, null, 2)}

Please analyze these events and:
1. Filter events that are appropriate for this family based on ages and interests
2. Rank the top 10 events by relevance and suitability
3. Prioritize events that are inclusive and suitable for multiple family members
4. Consider age appropriateness and family-friendly nature

Return your response as a JSON object with this structure:
{
  "rankedEventIds": [array of event IDs in order of preference, max 10]
}

Only return the JSON object, no additional text.`;
  }

  /**
   * Generate rationale for why an event was recommended
   * @param {Object} event - Event object
   * @param {Array} familyProfile - Family profile
   * @returns {string} Rationale text
   */
  generateRationale(event, familyProfile) {
    const ages = familyProfile.map(m => m.age);
    const minAge = Math.min(...ages);
    const maxAge = Math.max(...ages);

    let rationale = `This event is suitable for your family. `;

    if (event.ageHints && event.ageHints.toLowerCase().includes('all ages')) {
      rationale += `It welcomes all ages, perfect for families with members aged ${minAge} to ${maxAge}. `;
    } else if (event.ageHints) {
      rationale += `Age recommendation: ${event.ageHints}. `;
    }

    if (event.genderHints && event.genderHints.toLowerCase().includes('all')) {
      rationale += `This event is inclusive and welcoming to all. `;
    }

    return rationale.trim();
  }
}

module.exports = new LLMService();

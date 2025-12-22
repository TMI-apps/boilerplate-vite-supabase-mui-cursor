#  check-simple
Use the following workflow for any feature request I provide:

### Preparation Steps
1. Review the current state of the feature and summarize the relevant functionality, limitations, and context.
2. Identify the expert role(s) needed to address the request, including any roles required due to cascading technical or architectural considerations.
3. From the perspective of the identified expert, ask targeted questions that clarify design intent.
   - Number each question (1, 2, 3).
   - Provide example answers for each question, labeled (A, B, C, other).
   - Ensure questions enable confident transition to implementation once answered.

### After I answer the questions
Create an implementation plan in /documentation/jobs/job_[jobname] that:
- Prioritizes code efficiency, maintainability, consistency, and reuse.
- Minimizes complexity and avoids custom solutions where existing dependencies or patterns suffice.
- Reviews current functionality and intended end state.
- Includes pseudo-code sketches of required components.
- Identifies existing components that can be repurposed; for any new components, specify purpose, location, and how they remain reusable and non-redundant.

Apply this workflow for every feature request.

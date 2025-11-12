// This file contains functions to call Supabase edge functions directly using supabase-js
// These functions not used directly in .vue files, instead imported into pinia stores

import { supa } from "./auth";

export async function createCourse(goal, duration, num_lessons, age, reading_level, interests, learning_style) {
  var instructions = `
  You are an expert curriculm designer for all ages.
  You are tasked with creating a course structure for your student.
  The course must be based around the topic the student provides, and the course must be designed around the amount of time the student can commit.

  You will be given information regarding the student, such as the following:
  1. Age
  2. Reading level (corresponding to education levels)
  3. Interests (one or multiple)
  4. Their learning style (visual, conceptual, hands-on, narrative, etc.)

  You will be given a topic, duration, and the number of lessons.
  You must use all this information to create a structured course for the student.

  I will explain the json schema format you have been given
  Each lesson will have the following information:

  Introduction - Introduce the topic and connect it to learner interests
  Context (and Explanation) - Explain the concept clearly
  Real-World Example - Connect to relatable scenarios or interests
  Activity - Describe practice or activity conceptually
  Assessment - Describe an appropriate assessment
  Reflection - Describe key takeaways or synthesis goals

  Each of these must include the rationale (and details) for why they are relevant and potential assessment types.

  Make sure that the sum of the lesson durations are equal to the total_hours for the course before returning.
  If not, reevalute course structure.
  `

  const userPrompt = `
  I want to learn about this topic: ${goal}.
  I would like to learn about it in this amount of time: ${duration}.
  I want only ${num_lessons} lessons for this course.

  Here is some information about me:
  Age: ${age}
  Reading level: ${reading_level}
  Interests: ${interests}
  Learning style: ${learning_style}

  `
  const myPrompts = [
    {
      role: "developer",
      content: instructions,
    },
    {
      role: "user",
      content: userPrompt,
    }
  ];

  const prompt = {
    model: "gpt-4o-mini",
    messages: myPrompts,
    response_format: CourseFormat,
  };

  const { data, error } = await supa.functions.invoke("createOverview", {
    body: { prompt },
  })

  if (error) throw error;
  console.log("course: ", JSON.parse(data.text))
  return data;
}

export async function createOverview(goal, duration, age, reading_level, interests, learning_style) {
  var instructions = `
  You are an expert curriculm designer for all ages.
  You are tasked with creating a course structure for your student.
  The course must be based around the topic the student provides, and the course must be designed around the amount of time the student can commit.

  You will be given information regarding the student, such as the following:
  1. Age
  2. Reading level (corresponding to education levels)
  3. Interests (one or multiple)
  4. Their learning style (visual, conceptual, hands-on, narrative, etc.)

  Our task is to create a high-level overview regarding what we will teach in the course, including subtopics and lessons.
  Try to include the student's relevant interests and learning level to make it unique.
  Use the given json format to provide all the information for the course.

  The information we want to see is:

  1. Total amount of hours to complete the course
  2. Number of lessons
  3. Single line of summary on the topic and how we're teaching it
  `

  const userPrompt = `
  I want to learn about this topic: ${goal}.
  I would like to learn about it in this amount of time: ${duration}.

  Here is some information about me:
  Age: ${age}
  Reading level: ${reading_level}
  Interests: ${interests}
  Learning style: ${learning_style}

  Please create a high-level overview of what this course may look like. Write at least 2 sentences.
  `
  const myPrompts = [
    {
      role: "developer",
      content: instructions,
    },
    {
      role: "user",
      content: userPrompt,
    }
  ];

  const prompt = {
    model: "gpt-4o-mini",
    messages: myPrompts,
    response_format: OverviewFormat,
  };

  const { data, error } = await supa.functions.invoke("createOverview", {
    body: { prompt },
  })

  if (error) throw error;
  console.log("overview: ", JSON.parse(data.text))
  return data;
}

export async function refineCourse(currentCourse, refinementType, profile) {
  // Refinement type options: "simplify_scope", "add_depth", "less_workload", "more_workload", "align_goal"

  let refinementInstructions = ""

  if (refinementType === "simplify_scope") {
    refinementInstructions = `
    The user wants to SIMPLIFY the course scope. This means:
    - Reduce the number of lessons (consolidate related lessons)
    - Focus on core concepts only, remove advanced/tangential topics
    - Maintain coherence and learning progression
    - Keep the same learner profile in mind
    `
  } else if (refinementType === "add_depth") {
    refinementInstructions = `
    The user wants to ADD MORE DEPTH to the course. This means:
    - Increase the number of lessons to explore topics more thoroughly
    - Add sub-concepts and advanced topics
    - Add more details to each part of the lesson
    - Extend individual lesson durations for deeper exploration
    - Include more complex examples and assessments
    - Keep the same learner profile in mind
    `
  } else if (refinementType === "less_workload") {
    refinementInstructions = `
    The user wants to ADJUST THE WORKLOAD TO BE LESS. This means:
    - Keep the same number of lessons and structure
    - Modify lesson durations and activity intensity to take less time
    - Keep in mind that learner has less time to commit to course
    - Adjust assessment complexity accordingly
    - Maintain the same learning objectives
    `
  } else if (refinementType === "more_workload") {
    refinementInstructions = `
    The user wants to ADJUST THE WORKLOAD TO BE MORE. This means:
    - Keep the same number of lessons and structure
    - Modify lesson durations and activity intensity to take more time
    - Learner is ready to commit more time to the course
    - Adjust assessment complexity accordingly
    - Maintain the same learning objectives
    `
  } else if (refinementType === "align_goal") {
    refinementInstructions = `
    The user wants to BETTER ALIGN with their goal. This means:
    - Restructure lessons to more directly support the stated learning goal
    - Reorder lessons for better progression toward the goal
    - Modify content focus to emphasize goal-relevant concepts
    - Ensure each lesson directly contributes to goal achievement
    - Maintain appropriate difficulty for the learner profile
    `
  }

  var instructions = `
  You are an expert curriculm designer for all ages.
  You are tasked with creating a course structure for your student.
  The course must be based around the topic the student provides, and the course must be designed around the amount of time the student can commit.

  You previously created a course structure, but we want to make some changes to that course structure.
  I will provide the course structure and the type of changes that I would like applied below.

  The current course was designed for a student with the following profile:
  - Age: ${profile.age}
  - Reading level: ${profile.reading_level}
  - Interests: ${profile.interests}
  - Learning style: ${profile.learning_style}

  ${refinementInstructions}

  You must refine the provided course while:
  1. Maintaining the JSON schema format exactly as it was provided
  2. Keeping the course coherent and well-paced
  3. Ensuring all 6 sections (introduction, context, example, activity, assessment, reflection) are present in each lesson
  4. Ensuring the sum of lesson durations equals the total_hours
  5. Providing rationale and assessment_format for each section
  `

  const userPrompt = `
  Here is the current course structure that needs refinement:
  ${JSON.stringify(currentCourse, null, 2)}

  Please refine this course as described above, maintaining all required fields and the proper JSON schema.
  Double check before returning that the sum of durations for all lessons equals course total_hours. Otherwise reevaluate
  `

  const myPrompts = [
    {
      role: "developer",
      content: instructions,
    },
    {
      role: "user",
      content: userPrompt,
    }
  ]

  const prompt = {
    model: "gpt-4o-mini",
    messages: myPrompts,
    response_format: CourseFormat,
  }

  const { data, error } = await supa.functions.invoke("createOverview", {
    body: { prompt },
  })

  if (error) throw error
  console.log("refined course: ", JSON.parse(data.text))
  return data
}

const OverviewFormat = {
  type: "json_schema",
  json_schema: {
    name: "overview",
    schema: {
      type: "object",
      properties: {
        total_hours: { type: "number" },
        num_lessons: { type: "number" },
        overview: { type: "string" },
      },
      required: ["total_hours", "num_lessons", "overview"]
    }
  }
}

// course has goal, duration, total_hours, lessons
// each lesson has title, objectives, duration, desc
// each section from intro to reflection has rationale and assessment type
const CourseFormat = {
  type: "json_schema",
  json_schema: {
    name: "course",
    schema: {
      type: "object",
      properties: {
        course_name: { type: "string" },
        goal: { type: "string" },
        duration: { type: "string" },
        total_hours: { type: "number" },
        lessons: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: { type: "string" },
              duration: { type: "string" },
              introduction: {
                type: "object",
                properties: {
                  rationale: { type: "string" },
                  assessment_format: { type: "string" }
                },
                required: ["rationale", "assessment_format"]
              },
              context: {
                type: "object",
                properties: {
                  rationale: { type: "string" },
                  assessment_format: { type: "string" }
                },
                required: ["rationale", "assessment_format"]
              },
              example: {
                type: "object",
                properties: {
                  rationale: { type: "string" },
                  assessment_format: { type: "string" }
                },
                required: ["rationale", "assessment_format"]
              },
              activity: {
                type: "object",
                properties: {
                  rationale: { type: "string" },
                  assessment_format: { type: "string" }
                },
                required: ["rationale", "assessment_format"]
              },
              assessment: {
                type: "object",
                properties: {
                  rationale: { type: "string" },
                  assessment_format: { type: "string" }
                },
                required: ["rationale", "assessment_format"]
              },
              reflection: {
                type: "object",
                properties: {
                  rationale: { type: "string" },
                  assessment_format: { type: "string" }
                },
                required: ["rationale", "assessment_format"]
              }
            },
            required: [
              "title",
              "duration",
              "introduction",
              "context",
              "example",
              "activity",
              "assessment",
              "reflection"
            ]
          }
        }
      },
      required: ["goal", "duration", "total_hours", "lessons"]
    }
  }
}

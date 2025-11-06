// This file contains functions to call Supabase edge functions directly using supabase-js
// These functions not used directly in .vue files, instead imported into pinia stores

import { supa } from "./auth";

export async function createCourse(goal, duration, num_lessons, age, reading_level, interests, learning_style) {
  var instructions = `
  You are a course instructor tasked with creating a course structure for your student.
  The course must be relevant to the topic the student wants to learn, and must be structured around how quickly they want to learn it.

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

  Each of these must include the rationale for why they are relevant and potential assessment types.

  Make sure that the sum of the lesson durations are equal to the total_hours for the course
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
      role: "user",
      content: userPrompt,
    },
    {
      role: "developer",
      content: instructions,
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
  You are a course instructor tasked with creating a course structure for your student.
  The course must be relevant to the topic the student wants to learn, and must be structured around how quickly they want to learn it.

  You will be given information regarding the student, such as the following:
  1. Age
  2. Reading level (corresponding to education levels)
  3. Interests (one or multiple)
  4. Their learning style (visual, conceptual, hands-on, narrative, etc.)

  You will be given a topic and duration, and we will create an overview/summary for the course we are thinking of making.
  Use the given json format to provide all the information for the course.

  At this point, we are not creating the full course structure, but rather an overview.
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

  Please create a high-level overview of what this course may look like.
  `
  const myPrompts = [
    {
      role: "user",
      content: userPrompt,
    },
    {
      role: "developer",
      content: instructions,
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

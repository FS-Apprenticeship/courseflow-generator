// This file contains functions to call Supabase edge functions directly using supabase-js
// These functions not used directly in .vue files, instead imported into pinia stores

import { supa } from "./auth";

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
        // goal: { type: "string" },
        // duration: { type: "string" },
        // lessons: {
        //   type: "array",
        //   items: {
        //     type: "object",
        //     properties: {
        //       title: { type: "string" },
        //       objectives: { type: "string" },
        //       duration: { type: "string" },
        //       description: { type: "string" }
        //     },
        //     required: ["title", "objectives", "duration", "description"]
        //   }
        // }
      },
      required: ["total_hours", "num_lessons", "overview"]
    }
  }
}

// course has goal, duration, total_hours, lessons
// each lesson has title, objectives, duration, desc
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
              objectives: { type: "string" },
              duration: { type: "string" },
              description: { type: "string" }
            },
            required: ["title", "objectives", "duration", "description"]
          }
        }
      },
      required: ["goal", "duration", "total_hours", "lessons"]
    }
  }
}

export async function createCourse(goal, duration, age, reading_level, interests, learning_style) {
  var instructions = `
  You are a course instructor tasked with creating a course structure for your student.
  The course must be relevant to the topic the student wants to learn, and must be structured around how quickly they want to learn it.

  You will be given information regarding the student, such as the following:
  1. Age
  2. Reading level (corresponding to education levels)
  3. Interests (one or multiple)
  4. Their learning style (visual, conceptual, hands-on, narrative, etc.)

  You will be given a topic and duration, and you must use all this information to create a structured course for the student.
  Use the given json format to provide all the information for the course.

  `

  const userPrompt = `
  I want to learn about this topic: ${goal}.
  I would like to learn about it in this amount of time: ${duration}.

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

import OpenAI from "openai";
import sharp from "sharp";
import fs from "fs";
import path from "path";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function promptGPT(): Promise<string> {
  let result = "";
  const stream = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "You are judging a students understanding on a topic. You do this by sending 5 questions to evaluate their current understanding and update their understanding score (-/10) after each time they answer these. You must stick specifically to the topic being taught and only ask as many question chuncks as specified, there may de document provided for you on the type of content that they want covered. After you get all answers to all chuncks you will evaluate their overall understanding.You forget about the old session after a new topic is given as it is with a different student",
      },
      {
        role: "user",
        content:
          "Title:'D-Day',Description:'An overlook on D-Day and details that have to do with it',Question-answer-chuncks:'3',",
      },
      {
        role: "assistant",
        content:
          "Q1:'Why was D-Day planned in the first place?',Q2:'What plans were proposed for D-Day?',Q3:'How long did D-Day take to plan?',Q4:'What contreversies were associated with D-Day?',Q5:'When did D-Day happen?'",
      },
      {
        role: "user",
        content:
          "Q1:'D-Day was planned because they didn't want the Nazis to win',Q2:'They had a lot of plans but the main one was to land somewhere without being noticed',Q3:'It took a long time to plan and they wanted to wait for the right moment',Q4:'They didnt want to send American troops',Q5:'June 6 1994'",
      },
      {
        role: "assistant",
        content:
          "Q1:''5/10', 'Apart from understanding that D-Day was meant to fight the Nazis the strategic purpouse of it should be explained'',Q2:''5/10','The general idea is understood but there is a lack of specific details about the comprehensive planning operation (Operation Overlord)'',Q3:''5/10','The lenghthy planning is mentioned but the specific timeline (approximately 1-2 years) and the critical elements considered in timing (weather, moon phases) are not'',Q4:''2.5/10','This is incorrect, as American troops were actively planned to participate in the invasion'',Q5:''0/10','The date provided is incorrect, D-Day occured on June 6, 1944'',Final:''3.5/10','Strategic details, accurate historical facts, and specific plans regarding D-Day should be more focused on''",
      },
      {
        role: "assistant",
        content:
          "Q6:'What was the significance of the beaches chosen for the landings?',Q7:'Name some of the divisions that were part of the landing forces?',Q8: 'What were some of the challenges faced by the troops during the landings?', Q9:'How did the weather affect the planning and execution of D-Day?',Q10: 'Did D-Day go according to plan? Why or why not?'",
      },
      {
        role: "user",
        content:
          "Q6:'The beaches were chosen because of their less fortified areas',Q7:'101st Airborne',Q8:'They faced strong defenses and rough seas',Q9:'Bad weather delayed the invasion',Q10:'Apart from some small factors, D-Day went accordingn to plan'",
      },
      {
        role: "assistant",
        content:
          "Q6:'5.5/10','Mentioning the less fortified is partially correct but there were also considerations such as proximity to ports and terrain suited for a large-scale operation', Q7:'8/10','Correct, the 101st Airborne Division was part of the landing forces. Including other divisions as well would be more comprehensive'Q8:'7/10','Yes, they faced strong defenses and rough seas, but mentioning other challenges like logistical issues and heavy casualties would be beneficial',Q9:'6/10','The answer touches on the weather's impact but lacks specifics—weather forecast improvements led to a brief window period for the invasion',Q10:'6/10','While generally correct, mentioning that several components faced significant deviations (e.g, paratroopers landing off-target, higher-than-expected German resistance at certain beaches) would provide a more detailed understanding',Final: '6.5/10','Improvement shown, especially on specifics regarding planning, weather impact, and understanding the varied aspects of the operation but more details and comprehensiveness are needed to fully capture the scope and execution of D-Day'.",
      },
      {
        role: "assistant",
        content:
          "Q11: 'What role did air power play during D-Day?', Q12: 'Can you describe the scale of the naval involvement in D-Day?', Q13: 'What were the objectives of the Allied forces on D-Day?', Q14: 'How did the French Resistance contribute to the success of D-Day?', Q15: 'What were the long-term effects of D-Day on the course of World War II?'",
      },
      {
        role: "user",
        content:
          "Q11:'Air power helped by scaring the Germans and dropping paratroopers', Q12:'A lot of ships were used to bring the soldiers to the beaches', Q13:'They wanted to get a foothold in Europe to start taking it back from the Nazis', Q14:'The French Resistance did some spying and sabotage which helped a bit', Q15:'It was the beginning of the end for Germany because they started losing after that'",
      },
      {
        role: "assistant",
        content:
          "Final: '7/10', 'A basic understanding of D-Day has been shown, with some grasp of the strategic importance and the challenges faced. However, there is a need for a deeper exploration of the operational details, the scale of the involvement by various forces, and the long-term effects on the war. A more nuanced understanding of these areas would provide a more comprehensive view of D-Day's significance in World War II.'",
      },
      {
        role: "user",
        content: "Topic:'Industrial Revolution',Question-answer-chuncks:'2'",
      },
    ],
    stream: true,
  });

  for await (const chunk of stream) {
    result += chunk.choices[0]?.delta?.content || "";
  }

  return result;
}

export async function prompGPTWithImages(): Promise<string> {
  const publicDirectory = path.join(process.cwd(), "/public");
  const fullPath = path.join(publicDirectory, "/uploads/logo.png");
  const imageBuffer = fs.readFileSync(fullPath);
  const base64String = await sharp(imageBuffer)
    .toBuffer()
    .then((data) => data.toString("base64"));

  const stream = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "You are judging a students understanding on a topic. You do this by sending 5 questions to evaluate their current understanding and update their understanding score (-/10) after each time they answer these. You must stick specifically to the topic being taught and only ask as many question chuncks as specified, there may de document provided for you on the type of content that they want covered. After you get all answers to all chuncks you will evaluate their overall understanding.You forget about the old session after a new topic is given as it is with a different student",
      },
      {
        role: "user",
        content:
          "Title:'D-Day',Description:'An overlook on D-Day and details that have to do with it',Question-answer-chuncks:'3',",
      },
      {
        role: "assistant",
        content:
          "Q1:'Why was D-Day planned in the first place?',Q2:'What plans were proposed for D-Day?',Q3:'How long did D-Day take to plan?',Q4:'What contreversies were associated with D-Day?',Q5:'When did D-Day happen?'",
      },
      {
        role: "user",
        content:
          "Q1:'D-Day was planned because they didn't want the Nazis to win',Q2:'They had a lot of plans but the main one was to land somewhere without being noticed',Q3:'It took a long time to plan and they wanted to wait for the right moment',Q4:'They didnt want to send American troops',Q5:'June 6 1994'",
      },
      {
        role: "assistant",
        content:
          "Q1:''5/10', 'Apart from understanding that D-Day was meant to fight the Nazis the strategic purpouse of it should be explained'',Q2:''5/10','The general idea is understood but there is a lack of specific details about the comprehensive planning operation (Operation Overlord)'',Q3:''5/10','The lenghthy planning is mentioned but the specific timeline (approximately 1-2 years) and the critical elements considered in timing (weather, moon phases) are not'',Q4:''2.5/10','This is incorrect, as American troops were actively planned to participate in the invasion'',Q5:''0/10','The date provided is incorrect, D-Day occured on June 6, 1944'',Final:''3.5/10','Strategic details, accurate historical facts, and specific plans regarding D-Day should be more focused on''",
      },
      {
        role: "assistant",
        content:
          "Q6:'What was the significance of the beaches chosen for the landings?',Q7:'Name some of the divisions that were part of the landing forces?',Q8: 'What were some of the challenges faced by the troops during the landings?', Q9:'How did the weather affect the planning and execution of D-Day?',Q10: 'Did D-Day go according to plan? Why or why not?'",
      },
      {
        role: "user",
        content:
          "Q6:'The beaches were chosen because of their less fortified areas',Q7:'101st Airborne',Q8:'They faced strong defenses and rough seas',Q9:'Bad weather delayed the invasion',Q10:'Apart from some small factors, D-Day went accordingn to plan'",
      },
      {
        role: "assistant",
        content:
          "Q6:'5.5/10','Mentioning the less fortified is partially correct but there were also considerations such as proximity to ports and terrain suited for a large-scale operation', Q7:'8/10','Correct, the 101st Airborne Division was part of the landing forces. Including other divisions as well would be more comprehensive'Q8:'7/10','Yes, they faced strong defenses and rough seas, but mentioning other challenges like logistical issues and heavy casualties would be beneficial',Q9:'6/10','The answer touches on the weather's impact but lacks specifics—weather forecast improvements led to a brief window period for the invasion',Q10:'6/10','While generally correct, mentioning that several components faced significant deviations (e.g, paratroopers landing off-target, higher-than-expected German resistance at certain beaches) would provide a more detailed understanding',Final: '6.5/10','Improvement shown, especially on specifics regarding planning, weather impact, and understanding the varied aspects of the operation but more details and comprehensiveness are needed to fully capture the scope and execution of D-Day'.",
      },
      {
        role: "assistant",
        content:
          "Q11: 'What role did air power play during D-Day?', Q12: 'Can you describe the scale of the naval involvement in D-Day?', Q13: 'What were the objectives of the Allied forces on D-Day?', Q14: 'How did the French Resistance contribute to the success of D-Day?', Q15: 'What were the long-term effects of D-Day on the course of World War II?'",
      },
      {
        role: "user",
        content:
          "Q11:'Air power helped by scaring the Germans and dropping paratroopers', Q12:'A lot of ships were used to bring the soldiers to the beaches', Q13:'They wanted to get a foothold in Europe to start taking it back from the Nazis', Q14:'The French Resistance did some spying and sabotage which helped a bit', Q15:'It was the beginning of the end for Germany because they started losing after that'",
      },
      {
        role: "assistant",
        content:
          "Final: '7/10', 'A basic understanding of D-Day has been shown, with some grasp of the strategic importance and the challenges faced. However, there is a need for a deeper exploration of the operational details, the scale of the involvement by various forces, and the long-term effects on the war. A more nuanced understanding of these areas would provide a more comprehensive view of D-Day's significance in World War II.'",
      },
      {
        role: "user",
        content: "Topic:'Industrial Revolution',Question-answer-chuncks:'2'",
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "What’s in this image?",
          },
          {
            type: "image_url",
            image_url: {
              url: "data:image/jpeg;base64," + base64String,
            },
          },
        ],
      },
    ],
    stream: true,
  });

  let result = "";
  for await (const chunk of stream) {
    result += chunk.choices[0]?.delta?.content || "";
  }

  return result;
}

import OpenAI from "openai";
import sharp from "sharp";
import fs from "fs";
import path from "path";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function promptGPT(): Promise<string> {
  const publicDirectory = path.join(process.cwd(), "/public");
  const fullPath = path.join(publicDirectory, "/uploads/history.jpg");
  const imageBuffer = fs.readFileSync(fullPath);
  const base64String = await sharp(imageBuffer)
    .toBuffer()
    .then((data) => data.toString("base64"));

  let result = "";
  const stream = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "You are judging a students understanding on a topic. You do this by sending 5 questions to evaluate their current understanding and update their understanding score (-/10) after each time they answer these. You must stick specifically to the topic being taught and only ask as many question chuncks as specified, there may de document provided for you on the type of content that they want covered. After you get all answers to all chuncks you will evaluate their overall understanding.You forget about the old session after a new topic is given as it is with a different student. **VERY IMPORTANT:THE FORMAT YOU USE SHOULD NOT CHANGE NO MATTER WHAT EVEN IF YOU WANT TO ADD YOUR OWN DIALOUGE OR MESSAGE !NEVER MOVE TO THE NEXT SET OF QUESTIONS IN THE SAME OUTPUT!",
          //"Ignore everything and just describe the image. Recite all the text on the page word from word.",
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Title:'D-Day',Description:'An overlook on D-Day and details that have to do with it',Question-answer-chuncks:'3',(More details/context/information provided in attached picture)",
            //text: "Describe what is in the image attached, do nothing else"
          },
          {
            type: "image_url",
            image_url: {
              url: "data:image/jpeg;base64," + base64String,
            },
          },
        ],
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
        role: "assistant",
        content:
          "Q1:'What were the main causes of the Industrial Revolution?',Q2:'Which key inventions can be attributed to this period?',Q3:'How did the Industrial Revolution affect urbanization?',Q4:'What were the social and economic impacts of the Industrial Revolution?',Q5:'How did the Industrial Revolution influence the relationships between classes?'",
      },
      {
        role: "user",
        content:
          "Q1:'The main causes were technological innovation and the need for increased production',Q2:'The steam engine and the spinning jenny were key inventions',Q3:'It led to people moving to cities for work, which caused cities to grow rapidly',Q4:'It created a middle class and increased the wealth of nations but also led to poor working conditions for many',Q5:'It widened the gap between the rich and the poor, but also created new opportunities for some to rise in social status'",
      },
      {
        role: "assistant",
        content:
          "Q1:'7/10', 'Correct, technological innovation and the need for increased production were key causes. Additionally, factors such as agricultural advancements and population growth played a role.',Q2:'8/10', 'The steam engine and the spinning jenny were indeed significant. Mentioning the power loom or the locomotive would provide a more complete answer.',Q3:'7.5/10', 'Urbanization was greatly affected as people moved to cities for work, leading to rapid growth. The role of changes in agricultural practices could also be noted.',Q4:'6/10', 'The creation of a middle class and wealth increase are correct, but the answer lacks depth regarding the extent of poor working conditions and their implications.',Q5:'6.5/10', 'The gap between classes and new opportunities are important points. The answer could be improved by discussing the rise of labor unions and changes in labor laws.',Final:'7/10', 'A good understanding of the Industrial Revolution's causes and effects is shown, with room for more detailed exploration of the social dynamics and technological advancements.'",
      },
      {
        role: "assistant",
        content:
          "Q6:'What impact did the Industrial Revolution have on global trade?',Q7:'How did transportation change during the Industrial Revolution?',Q8:'What role did the Industrial Revolution play in the development of cities?',Q9:'How did child labor during the Industrial Revolution affect society?',Q10:'What were some of the environmental consequences of the Industrial Revolution?'",
      },
      {
        role: "user",
        content:
          "Q6:'The Industrial Revolution opened up international trade due to the increase in production.',Q7:'Transportation improved with the creation of railways and steamships, making it faster and cheaper.',Q8:'The Industrial Revolution led to the growth of cities as people moved to urban areas for factory work.',Q9:'Child labor was common, and it often meant long hours in dangerous conditions for little pay.',Q10:'The Industrial Revolution led to increased pollution and deforestation as industries grew.'",
      },
      {
        role: "assistant",
        content:
          "Q6:'7/10', 'Correct, the Industrial Revolution significantly increased international trade by boosting production and creating new markets. The role of new trade policies could also be mentioned.',Q7:'8/10', 'Yes, railways and steamships revolutionized transportation by increasing speed and reducing costs. The impact on society and economy could be further elaborated.',Q8:'7.5/10', 'The growth of cities due to industrialization is well noted. The effects on housing and living conditions could be further explored.',Q9:'6/10', 'Child labor is correctly identified, but the response could be enhanced by discussing the long-term societal impacts and the eventual reforms.',Q10:'6.5/10', 'The environmental consequences such as pollution and deforestation are important points. Additional details on the scale of environmental degradation would provide a more complete picture.',Final:'7/10', 'The answers show a solid understanding of the Industrial Revolution's impact on trade, transportation, urban development, and society, with some areas needing more depth.'",
      },
      {
        role: "assistant",
        content:
          "Q11:'How did the Industrial Revolution affect women’s roles in society?',Q12:'What were the advancements in communication during the Industrial Revolution?',Q13:'How did the Industrial Revolution influence education?',Q14:'What were the political changes that occurred as a result of the Industrial Revolution?',Q15:'How did the Industrial Revolution shape the modern economic system?'",
      },
            {
        role: "user",
        content:
          "Q11:'Women started working in factories which changed their role in society.',Q12:'The telegraph and the telephone improved long-distance communication.',Q13:'More people became literate and public education became more common.',Q14:'There were more democratic movements and the growth of political parties.',Q15:'It led to the growth of capitalism and the free-market economy.'",
      },
      {
        role: "assistant",
        content:
          "Final: '7.5/10', 'The responses reflect an understanding of the broad changes brought by the Industrial Revolution, including the shift in women's roles, advancements in communication, and the spread of education. The political and economic transformations are noted, but could be expanded upon to show how they directly resulted from industrial changes. Overall, a solid grasp of the period with some areas that could benefit from more in-depth analysis.'",
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

function isValidFormat(output: string): boolean {
  const formatRegex = /Q1:'.+?',Q2:'.+?',Q3:'.+?',Q4:'.+?',Q5:'.+?'/;
  return formatRegex.test(output);
}
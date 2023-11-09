import express from 'express';  
import { OpenAIClient, AzureKeyCredential } from "@azure/openai";  
import cors from 'cors';  
import { createClient } from "@supabase/supabase-js";  
import { ulid } from 'ulid';  
import bodyParser from 'body-parser';  
import helmet from 'helmet';  
import morgan from 'morgan';  
import dotenv from "dotenv/config";  
  
const app = express();  
const PORT = process.env.PORT || 3000;  
app.use(cors());  
app.use(bodyParser.json());  
app.use(morgan('combined'));  
app.use(helmet());  
  
const supabaseUri = process.env.SUPABASE_URI;  
const supabaseKey = process.env.SUPABASE_KEY;  
const supabase = createClient(supabaseUri, supabaseKey);  
  
// You will need to set these environment variables or edit the following values  
const endpoint = process.env.ENDPOINT;  
const azureApiKey = process.env.AZURE_KEY;  
const ulidgen=ulid();
  
const mess = [  
  { role: "system", content: "You are a helpful assistant." }];
  
function isValidFormat(message) {  
  if (typeof message !== 'object') return false; // Check if message is an object first.  
  if (!message.role || !message.content) return false;  
  return true;  
}  
  
// async function getChatbotResponse(message) {  
//   const client = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey));  
//   const deploymentId = "gpt-35-turbo-16k";  
//   const result = await client.getCompletions(deploymentId, message, { maxTokens: 128 });  
//   for (const choice of result.choices) {  
//     console.log(choice.text);  
//   }  
// }  
async function getChatbotResponse(messa) {
  //  generate messages ultitlizing both the mess string and the user request
const messages = [...mess,...messa];  

  console.log(messages);

  const client = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey));
  const deploymentId = "gpt-35-turbo";
  const result = await client.getChatCompletions(deploymentId, messages);
console.log(result_;
  // for (const choice of result.choices) {
  //   console.log(choice.message);
  //   return (choice.message);
  // }
      console.log("Tokens Used:", result.usage.totalTokens);  
    console.log("Cost:", result.usage.totalCost); 
}

function test(messa)
{
return messa;
}

  
app.all("*", async (req, res) => {  
  const data = req.body;  
  const jsonString = JSON.stringify(data);  
  const strippedStr = jsonString.replace(/`/g, '');  
  
  if (!data.messages || !Array.isArray(data.messages)) {  
    res.send('No messages found in request body');  
    return;  
  } else {  
 
  const response = await getChatbotResponse(data.messages);
res.send(response);
      // const tokenCount = response.usage.totalTokens;  
  // const cost = response.usage.totalCost;  
    // console.log(tokenCount);
    // console.log(cost);
    // res.send(test(data.messages));
    let dbdata={
        created_at: new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }),
        input:data,
        out:response,
      ulid:ulidgen
      // token:tokenCount,
      // cost:cost
    };
        // Insert the log entry into Supabase
    const { data: logEntry, error } = await supabase
        .from("azure_req_res")
        .insert([dbdata]);

    if (error) {
        console.error("Error inserting log:", error);
        // Handle the error  
    } 
    else {
        // Access the inserted data  
        console.log("Log entry inserted:", logEntry);
    }
        
    }

  

    let log = {
        status: "ok",
        url: req.originalUrl,
        ip_address: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        request_body: req.body,
        request_method: req.method,
        lat: req.headers['x-vercel-ip-latitude'],
        lon: req.headers['x-vercel-ip-longitude'],
        city: req.headers['x-vercel-ip-city'],
        region: req.headers['x-vercel-ip-country-region'],
        country: req.headers['x-vercel-ip-country'],
        UA: req.headers['user-agent'],
        // uuid: uuidv4(),
        date_time: new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }),
        ulid: ulidgen
    };

    // Insert the log entry into Supabase
    const { data: logEntry, error } = await supabase
        .from("logs")
        .insert([log]);

    if (error) {
        console.error("Error inserting log:", error);
        // Handle the error  
    } 
    else {
        // Access the inserted data  
        console.log("Log entry inserted:", logEntry);
    }
  
}); 


  
app.listen(PORT, () => {  
  console.log(`Server listening on port ${PORT}`);  
});  

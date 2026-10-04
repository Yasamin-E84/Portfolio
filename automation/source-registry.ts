export type EditorialSource = { name:string; url:string; category:"AI"|"Frontend"|"Industry"|"Security"|"Tools"; method:"rss"|"api"|"page"; primary:boolean };

export const editorialSources:EditorialSource[]=[
  {name:"OpenAI News",url:"https://openai.com/news/",category:"AI",method:"page",primary:true},
  {name:"Google AI",url:"https://blog.google/technology/ai/",category:"AI",method:"page",primary:true},
  {name:"Microsoft AI",url:"https://blogs.microsoft.com/ai/",category:"AI",method:"page",primary:true},
  {name:"Anthropic Newsroom",url:"https://www.anthropic.com/news",category:"AI",method:"page",primary:true},
  {name:"Hugging Face Blog",url:"https://huggingface.co/blog",category:"AI",method:"page",primary:true},
  {name:"React Blog",url:"https://react.dev/blog",category:"Frontend",method:"page",primary:true},
  {name:"Next.js Blog",url:"https://nextjs.org/blog",category:"Frontend",method:"page",primary:true},
  {name:"JavaScript Weekly",url:"https://javascriptweekly.com/rss/",category:"Frontend",method:"rss",primary:false},
  {name:"Hacker News",url:"https://hacker-news.firebaseio.com/v0/topstories.json",category:"Industry",method:"api",primary:false},
  {name:"TechCrunch",url:"https://techcrunch.com/feed/",category:"Industry",method:"rss",primary:false},
  {name:"The Verge",url:"https://www.theverge.com/rss/index.xml",category:"Industry",method:"rss",primary:false},
];

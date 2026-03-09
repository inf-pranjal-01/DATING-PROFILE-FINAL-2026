<h1>For You – Interactive Web + AI Project</h1>

<p>
<b>For You</b> is a small web project that combines an interactive frontend
with an AI chatbot backend.
</p>
<hr>
<p>
The site includes a chat system where visitors can talk to <b>Kaluii</b>, a simple AI
pet companion that answers questions using a Retrieval-Augmented Generation (RAG)
backend connected to a FastAPI service.
</p>

<p>
This project was built as a fun <b>Valentine's Day</b> college project while focusing on
learning how to connect a modern frontend interface with an AI-powered backend.
</p>

<p>
Parts of the frontend were iterated with the help of AI tooling, while the backend
logic, RAG pipeline, API integration, and deployment were implemented manually.
</p>
<hr>

<h2>Overview</h2>

<p>
The project focuses on combining simple UI interactions with an AI chat system.
It includes animation-based UI elements, background music playback,
and a chatbot connected to a backend service.
</p>

<p>Main elements include:</p>

<ul>
<li>Scroll-based hero section animation</li>
<li>Interactive album cover with a sliding vinyl effect</li>
<li>Custom mini music player</li>
<li>AI chatbot interface</li>
<li>Retrieval-Augmented Generation backend</li>
<li>Kalui – a small AI pet companion</li>
</ul>


<h2>Architecture</h2>

<pre>
Browser
   ↓
Vercel (Frontend - React + Vite)
   ↓
Render (FastAPI Backend)
   ↓
LLM Provider (OpenAI / OpenRouter)
</pre>

<p>
The frontend and backend are deployed separately to keep the system modular
and easier to update.
</p>


<h2>Frontend</h2>

<p><b>Built with:</b></p>

<ul>
<li>React (TypeScript)</li>
<li>Vite</li>
<li>Framer Motion</li>
<li>Tailwind CSS</li>
<li>HTML5 Audio API</li>
</ul>

<p><b>Features:</b></p>

<ul>
<li>Scroll-based layout transitions</li>
<li>Animated vinyl disk interaction</li>
<li>Mini music player with autoplay</li>
<li>Smooth animations using Framer Motion</li>
<li>Responsive layout</li>
</ul>


<h2>Backend</h2>

<p><b>Built with:</b></p>

<ul>
<li>Python</li>
<li>FastAPI</li>
<li>Uvicorn</li>
<li>Environment-based configuration</li>
<li>LLM API integration</li>
<li>Retrieval-Augmented Generation (RAG)</li>
</ul>

<p><b>Backend capabilities:</b></p>

<ul>
<li><code>/chat</code> API endpoint</li>
<li>Structured request and response handling</li>
<li>Secure API key management using environment variables</li>
<li>RAG-based chatbot responses</li>
<li>Deployment on Render</li>
</ul>

<hr>
<h2>Deployment</h2>

<h3>Frontend</h3>

<ul>
<li>Deployed on <b>Vercel</b></li>
<li>Automatic builds from GitHub</li>
<li>Backend routing via environment variables</li>
<li>Static hosting for audio assets</li>
</ul>

<p>
Live site:
<a href="https://dating-profile-final-2026.vercel.app/">
https://dating-profile-final-2026.vercel.app/
</a>
</p>


<h3>Backend</h3>

<ul>
<li>Deployed on <b>Render</b> (may take some time to get response for the first time) </li>
<li>Persistent FastAPI service</li>
<li>Production Uvicorn configuration</li>
<li>Secure environment variable management</li>
</ul>

<p align="center">Curiosity looks good on you — we might look good together.</p> 

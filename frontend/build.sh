#!/bin/bash
# Render build script for frontend
npm install
VITE_API_URL=https://digital-cognitive-twin.onrender.com npm run build

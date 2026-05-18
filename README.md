# WMATA Incidents Dashboard

[NOTE: Code committed to wrong branch on 5/17, README copied here]

# Description:

This is the WMATA Incidents Dashboard. It is a web application that presents and displays ongoing/current WMATA transportation incidents taken from the WMATA Bus and Rail Incidents APIs. It presents a descriptive box of each incident (time updated, description, and routes/lines affected) and a bar chart that displays the number of bus and rail incidents respectively. The target browser of this application would preferably be Windows (which would work best on any browser like Chrome). 

[Developer Manual](#developer-manual)





## Developer Manual
### Frontend
- HTML/CSS
- JavaScript
- Chart.js
- Typed.js

### Backend
- Node.js
- Express
- Supabase
- WMATA API

## Installation:
-Clone the repository: git clone https://github.com/vle000/wmata_incidents
-Download the dependencies: (use npm install)
- express
- body-parser
- @supabase/supabase-js

# Frontend Pages

## Home Page
`index.html`

Main application page:
- Search incidents
- Display live WMATA alerts
- Render Chart.js visualizations

## About Page
`about.html`

Contains project description and goals.

## Tutorial Page
`tutorial.html`

Explains how users interact with the application.

# API Documentation

Base URL: http://localhost:3000

Type this in the terminal: node index.js

# GET /api/searches

Retrieves all previously saved search queries from Supabase.

## Example Request:
GET /api/searches

# POST /api/search

Stores a user search query in Supabase. (POST ONLY)

# Frontend Libraries

## Chart.js

Used to:
- Render incident statistics
- Visualize bus vs rail incidents

## Typed.js

Used to:
- Make the search appearance more visually appealing
- Gives user an idea of what the WMATA lines are

# Backend Library

## Supabase

Used to:
- Store recent user searches and store them into external database
- Note: It is currently not fully functional

# Important Notes:
- A 500 error may appear in the console when interacting with the search button in the homepage, although the search feature is working properly.
- Sometimes, it shows up when more than 1 search appears in the Supabase
# Future notes:
- I plan to continue working on this project to fully finish it in one polished application. As of now, it's shown here to meet a deadline.
- I hope I can use more time to develop the supabase connection to this project so it can properly insert and extract data from an external database.
- CSS could use some work to make it more visually appealing. 

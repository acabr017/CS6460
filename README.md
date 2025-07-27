# The Long View - Year-long Unit Planner

A full-stack web application to help educators when planning their classes. Designed for planning units throughout the school year to better visualize the amount of time planned for each topic/unit.

## Tech stack

### Backend

- django
- django REST Framework
- python decouple

### Frontend

- React
- Material UI
- FullCalendar

## Features

- Full CRUD functionality for School Years, Classes and Units
- Define out-of-service days for school year
- Drag and Drop units onto calendar, automatically skipping weekends and predefined out-of-service dates.

## Installation & Setup for Local

1. `git clone https://github.com/acabr017/CS6460.git`
2. `cd school-calendar-planner`
3. `cd backend`
4. `python -m venv venv`
5. `source venv/bin/activate` or `. venv\Scripts\activate` on Windows
6. `pip install -r requirements.txt`
7. `cp .env.example .env` then fill in your django SECRET_KEY and DB info, and email host server and password
8. `python manage.py make migration`
9. `python manage.py migrate`
10. `python manage.py runserver`

## Example Project Structure

school-calendar-planner/

├── backend/

│ ├── manage.py

│ ├── calendar_app/

│ └── .env

├── frontend/

│ ├── src/

│ ├── public/

│ └── .env

├── .gitignore

├── README.md

## Live Demo

Coming soon.

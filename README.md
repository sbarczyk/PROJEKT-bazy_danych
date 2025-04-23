Projekt: GymTracker

Autorzy: Szymon Barczyk, Jan Dyląg

Cel projektu

Aplikacja do monitorowania treningów siłowych i progresu sylwetki użytkownika z możliwością zapisywania się na wspólne treningi z trenerem personalnym oraz testy siłowe ze znajomymi.

Cele funkcjonalne
	1.	CRUD
	•	Dodawanie/edycja/usuwanie:
	•	ćwiczeń (również własnych użytkownika)
	•	treningów (daty, ćwiczenia, serie, powtórzenia, ciężar)
	•	pomiarów ciała (waga, biceps, klatka itd.)
	2.	Operacje transakcyjne i kontrola równoczesnego dostępu
	•	Rejestracja na limitowane wydarzenia, np. testy siły, wspólne treningi z trenerem – z ograniczoną liczbą miejsc.
	3.	Raportowanie / zapytania agregujące
	•	Progres siłowy (np. max ciężar w martwym ciągu)
	•	Zmiany obwodów ciała w czasie
	•	Najczęściej wykonywane ćwiczenia
	•	Średnia liczba serii na tydzień

Model danych (kolekcje)
	•	users: dane użytkownika
	•	exercises: dostępne ćwiczenia
	•	workouts: zapisy treningów z datą i seriami
	•	measurements: pomiary sylwetki
	•	events: limitowane wydarzenia (z możliwością rejestracji)

Technologie

Warstwa	Technologia
Baza danych	MongoDB
Backend	Node.js + Express + Mongoose
Frontend	React (opcjonalnie) / testy w Postmanie
Narzędzia	Docker, MongoDB Compass, DataGrip

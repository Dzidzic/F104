# F104 (DitRed)

Platforma społecznościowa umożliwiająca tworzenie społeczności, publikowanie postów oraz interakcję między użytkownikami. Projekt został zbudowany w oparciu o Node.js oraz MongoDB, realizując wzorzec projektowy MVC.

## 🚀 Funkcjonalności

### Użytkownicy
* **System Autoryzacji:** Rejestracja i logowanie z walidacją danych (wymagania dotyczące hasła).
* **Zarządzanie Sesją:** Trwała sesja użytkownika z wykorzystaniem `express-session` i MongoDB.

### Społeczności (Communities)
* **Przeglądanie:** Lista wszystkich dostępnych społeczności z filtrowaniem po tematyce.
* **Tworzenie:** Możliwość założenia własnej społeczności z opisem i unikalnym tagiem.
* **Zarządzanie:** Edycja i usuwanie własnych społeczności przez administratora/twórcę.

### Posty
* **Publikowanie:** Dodawanie postów wewnątrz konkretnych społeczności.
* **Interakcja:** System polubień (Likes) zapobiegający wielokrotnemu głosowaniu przez tę samą osobę.
* **Spoilery:** Możliwość oznaczania treści jako spoilery (ukryte do momentu kliknięcia).
* **Tagowanie:** Dodawanie tagów do postów ułatwiające kategoryzację treści.

---

## 🛠 Technologie

* **Backend:** [Node.js](https://nodejs.org/) + [Express.js](https://expressjs.com/)
* **Baza danych:** [MongoDB](https://www.mongodb.com/)
* **Widoki (View Engine):** [EJS](https://ejs.co/) + Layouts
* **Stylizacja:** CSS (Dark Mode / Reddit Style)
* **Zarządzanie sesją:** `connect-mongo`

---

## 📍 Lista Endpointów

| Metoda | Endpoint | Opis |
| :--- | :--- | :--- |
| **GET** | `/` | Strona główna z listą społeczności |
| **GET** | `/about` | Strona informacyjna o projekcie |
| **GET** | `/c` | Lista społeczności |
| **GET** | `/c/add` | Formularz tworzenia nowej społeczności |
| **POST** | `/c/add` | Tworzenie nowej społeczności |
| **GET** | `/c/:commId` | Widok konkretnej społeczności i jej listy postów |
| **GET** | `/c/:commId/edit` | Formularz edycji społeczności (tylko właściciel) |
| **POST** | `/c/:commId/edit` | Zaktualizowanie danych społeczności |
| **POST** | `/c/:commId/delete` | Usunięcie społeczności |
| **GET** | `/c/:commId/post/add` | Formularz dodawania posta w danej społeczności |
| **POST** | `/c/:commId/post/add` | Opublikowanie nowego posta |
| **GET** | `/c/:commId/post/:postId` | Szczegóły konkretnego posta |
| **GET** | `/c/:commId/post/:postId/edit` | Formularz edycji posta (tylko autor) |
| **POST** | `/c/:commId/post/:postId/edit` | Zaktualizowanie treści posta |
| **POST** | `/c/:commId/post/:postId/like` | Polubienie posta |
| **POST** | `/c/:commId/post/:postId/delete` | Usunięcie posta |
| **GET** | `/auth/login` | Formularz logowania |
| **POST** | `/auth/login` | Proces logowania |
| **GET** | `/auth/register` | Formularz rejestracji |
| **POST** | `/auth/register` | Proces rejestracji |
| **GET** | `/auth/logout` | Wylogowanie użytkownika |

## ⚙️ Instalacja i uruchomienie

### Wymagania
* Node.js (v18 lub nowszy)
* Zainstalowana i uruchomiona baza danych MongoDB

### Kroki instalacji
1.  Skonfiguruj plik `.env` w głównym katalogu wartościami podanymi przez autora, tak jak podano to w pliku `.env.example`:
    ```env
    MONGO_URI="mongodb://<user>:<password>@mongo:27017"
    MONGO_USER="[nazwaUzytkownika]"
    MONGO_PASSWORD="[hasloUzytkownika]"
    SESSION_SECRET="[losowyTekst]"  
    ```
2.  Upewnij się że masz zainstalowany Docker Desktop, a następnie wykonaj komendę:
    ```bash
    docker-compose up --build
    ```

Aplikacja będzie dostępna pod adresem: `http://localhost:8080`

---

## ⚖️ Licencja
Projekt wydany na licencji **MIT**. Szczegóły w pliku `LICENSE`.

## 👥 Autor
* **Mateusz Dziedzic** 

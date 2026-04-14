from __future__ import annotations

import sqlite3
from pathlib import Path


BACKEND_DIR = Path(__file__).resolve().parents[2]
DATA_DIR = BACKEND_DIR / "data"
DB_PATH = DATA_DIR / "employment_system.db"


def get_connection() -> sqlite3.Connection:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def init_db() -> None:
    connection = get_connection()
    cursor = connection.cursor()

    cursor.executescript(
        """
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS enterprises (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            social_credit_code TEXT UNIQUE NOT NULL,
            contact_person TEXT NOT NULL,
            contact_phone TEXT NOT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS employment_records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            enterprise_id INTEGER NOT NULL,
            report_month TEXT NOT NULL,
            employed_count INTEGER NOT NULL DEFAULT 0,
            new_hires INTEGER NOT NULL DEFAULT 0,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (enterprise_id) REFERENCES enterprises(id)
        );

        CREATE TABLE IF NOT EXISTS unemployment_records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            enterprise_id INTEGER NOT NULL,
            report_month TEXT NOT NULL,
            unemployed_count INTEGER NOT NULL DEFAULT 0,
            layoffs INTEGER NOT NULL DEFAULT 0,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (enterprise_id) REFERENCES enterprises(id)
        );
        """
    )

    cursor.execute(
        "INSERT OR IGNORE INTO users (username, password, role) VALUES (?, ?, ?)",
        ("admin", "admin123", "admin"),
    )

    cursor.execute(
        """
        INSERT OR IGNORE INTO enterprises
        (id, name, social_credit_code, contact_person, contact_phone)
        VALUES (?, ?, ?, ?, ?)
        """,
        (1, "昆明云企科技有限公司", "91530100YN001", "张敏", "13800000001"),
    )

    cursor.execute(
        """
        INSERT OR IGNORE INTO employment_records
        (id, enterprise_id, report_month, employed_count, new_hires)
        VALUES (?, ?, ?, ?, ?)
        """,
        (1, 1, "2026-04", 48, 6),
    )

    cursor.execute(
        """
        INSERT OR IGNORE INTO unemployment_records
        (id, enterprise_id, report_month, unemployed_count, layoffs)
        VALUES (?, ?, ?, ?, ?)
        """,
        (1, 1, "2026-04", 4, 1),
    )

    connection.commit()
    connection.close()

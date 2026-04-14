from __future__ import annotations

import sqlite3
from pathlib import Path


BACKEND_DIR = Path(__file__).resolve().parents[2]
DATA_DIR = BACKEND_DIR / "data"
DB_PATH = DATA_DIR / "employment_system.db"


def table_columns(connection: sqlite3.Connection, table_name: str) -> set[str]:
    return {
        row["name"] for row in connection.execute(f"PRAGMA table_info({table_name})").fetchall()
    }


def ensure_column(connection: sqlite3.Connection, table_name: str, column_name: str, definition: str) -> None:
    if column_name not in table_columns(connection, table_name):
        connection.execute(f"ALTER TABLE {table_name} ADD COLUMN {column_name} {definition}")


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
            role TEXT NOT NULL,
            display_name TEXT DEFAULT '',
            organization_name TEXT DEFAULT '',
            enterprise_id INTEGER
        );

        CREATE TABLE IF NOT EXISTS enterprises (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            social_credit_code TEXT UNIQUE NOT NULL,
            contact_person TEXT NOT NULL,
            contact_phone TEXT NOT NULL,
            industry_type TEXT DEFAULT '综合服务',
            city_name TEXT DEFAULT '昆明市',
            province_name TEXT DEFAULT '云南省',
            reporting_frequency_rule TEXT DEFAULT 'Q1_HALF_MONTH_OTHER_MONTHLY',
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS employment_records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            enterprise_id INTEGER NOT NULL,
            report_type TEXT NOT NULL DEFAULT 'monthly',
            report_period TEXT NOT NULL,
            employed_count INTEGER NOT NULL DEFAULT 0,
            new_hires INTEGER NOT NULL DEFAULT 0,
            workflow_status TEXT NOT NULL DEFAULT 'draft',
            city_review_comment TEXT DEFAULT '',
            province_review_comment TEXT DEFAULT '',
            submitted_by INTEGER,
            submitted_at TEXT,
            city_reviewed_at TEXT,
            province_reviewed_at TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (enterprise_id) REFERENCES enterprises(id)
        );

        CREATE TABLE IF NOT EXISTS unemployment_records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            enterprise_id INTEGER NOT NULL,
            report_type TEXT NOT NULL DEFAULT 'monthly',
            report_period TEXT NOT NULL,
            unemployed_count INTEGER NOT NULL DEFAULT 0,
            layoffs INTEGER NOT NULL DEFAULT 0,
            workflow_status TEXT NOT NULL DEFAULT 'draft',
            city_review_comment TEXT DEFAULT '',
            province_review_comment TEXT DEFAULT '',
            submitted_by INTEGER,
            submitted_at TEXT,
            city_reviewed_at TEXT,
            province_reviewed_at TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (enterprise_id) REFERENCES enterprises(id)
        );
        """
    )

    ensure_column(connection, "users", "display_name", "TEXT DEFAULT ''")
    ensure_column(connection, "users", "organization_name", "TEXT DEFAULT ''")
    ensure_column(connection, "users", "enterprise_id", "INTEGER")

    ensure_column(connection, "enterprises", "industry_type", "TEXT DEFAULT '综合服务'")
    ensure_column(connection, "enterprises", "city_name", "TEXT DEFAULT '昆明市'")
    ensure_column(connection, "enterprises", "province_name", "TEXT DEFAULT '云南省'")
    ensure_column(connection, "enterprises", "reporting_frequency_rule", "TEXT DEFAULT 'Q1_HALF_MONTH_OTHER_MONTHLY'")

    ensure_column(connection, "employment_records", "report_type", "TEXT DEFAULT 'monthly'")
    ensure_column(connection, "employment_records", "report_period", "TEXT DEFAULT ''")
    ensure_column(connection, "employment_records", "workflow_status", "TEXT DEFAULT 'draft'")
    ensure_column(connection, "employment_records", "city_review_comment", "TEXT DEFAULT ''")
    ensure_column(connection, "employment_records", "province_review_comment", "TEXT DEFAULT ''")
    ensure_column(connection, "employment_records", "submitted_by", "INTEGER")
    ensure_column(connection, "employment_records", "submitted_at", "TEXT")
    ensure_column(connection, "employment_records", "city_reviewed_at", "TEXT")
    ensure_column(connection, "employment_records", "province_reviewed_at", "TEXT")

    ensure_column(connection, "unemployment_records", "report_type", "TEXT DEFAULT 'monthly'")
    ensure_column(connection, "unemployment_records", "report_period", "TEXT DEFAULT ''")
    ensure_column(connection, "unemployment_records", "workflow_status", "TEXT DEFAULT 'draft'")
    ensure_column(connection, "unemployment_records", "city_review_comment", "TEXT DEFAULT ''")
    ensure_column(connection, "unemployment_records", "province_review_comment", "TEXT DEFAULT ''")
    ensure_column(connection, "unemployment_records", "submitted_by", "INTEGER")
    ensure_column(connection, "unemployment_records", "submitted_at", "TEXT")
    ensure_column(connection, "unemployment_records", "city_reviewed_at", "TEXT")
    ensure_column(connection, "unemployment_records", "province_reviewed_at", "TEXT")

    cursor.execute(
        """
        INSERT OR IGNORE INTO enterprises
        (id, name, social_credit_code, contact_person, contact_phone, industry_type, city_name, province_name, reporting_frequency_rule)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            1,
            "昆明云企科技有限公司",
            "91530100YN001",
            "张敏",
            "13800000001",
            "数字服务",
            "昆明市",
            "云南省",
            "Q1_HALF_MONTH_OTHER_MONTHLY",
        ),
    )

    cursor.execute(
        """
        INSERT OR IGNORE INTO users
        (id, username, password, role, display_name, organization_name, enterprise_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """,
        (1, "admin", "admin123", "admin", "系统管理员", "省级平台管理中心", None),
    )

    cursor.execute(
        """
        INSERT OR IGNORE INTO users
        (id, username, password, role, display_name, organization_name, enterprise_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """,
        (2, "enterprise_demo", "enterprise123", "enterprise", "企业填报员", "昆明云企科技有限公司", 1),
    )

    cursor.execute(
        """
        INSERT OR IGNORE INTO users
        (id, username, password, role, display_name, organization_name, enterprise_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """,
        (3, "city_reviewer", "city123456", "city_reviewer", "昆明市审核员", "昆明市人社局", None),
    )

    cursor.execute(
        """
        INSERT OR IGNORE INTO users
        (id, username, password, role, display_name, organization_name, enterprise_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """,
        (4, "province_reviewer", "province123", "province_reviewer", "云南省审核员", "云南省人社厅", None),
    )

    cursor.execute(
        """
        INSERT OR IGNORE INTO employment_records
        (id, enterprise_id, report_type, report_period, employed_count, new_hires, workflow_status, submitted_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (1, 1, "monthly", "2026-04", 48, 6, "city_pending", 2),
    )

    cursor.execute(
        """
        INSERT OR IGNORE INTO unemployment_records
        (id, enterprise_id, report_type, report_period, unemployed_count, layoffs, workflow_status, submitted_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (1, 1, "monthly", "2026-04", 4, 1, "city_pending", 2),
    )

    if "report_month" in table_columns(connection, "employment_records"):
        cursor.execute(
            "UPDATE employment_records SET report_period = report_month WHERE report_period = '' AND report_month IS NOT NULL"
        )

    if "report_month" in table_columns(connection, "unemployment_records"):
        cursor.execute(
            "UPDATE unemployment_records SET report_period = report_month WHERE report_period = '' AND report_month IS NOT NULL"
        )

    cursor.execute(
        """
        UPDATE users
        SET display_name = '系统管理员', organization_name = '省级平台管理中心'
        WHERE username = 'admin' AND (display_name = '' OR organization_name = '')
        """
    )
    cursor.execute(
        """
        UPDATE users
        SET display_name = '企业填报员', organization_name = '昆明云企科技有限公司', enterprise_id = 1
        WHERE username = 'enterprise_demo'
        """
    )
    cursor.execute(
        """
        UPDATE users
        SET display_name = '昆明市审核员', organization_name = '昆明市人社局'
        WHERE username = 'city_reviewer'
        """
    )
    cursor.execute(
        """
        UPDATE users
        SET display_name = '云南省审核员', organization_name = '云南省人社厅'
        WHERE username = 'province_reviewer'
        """
    )
    cursor.execute(
        """
        UPDATE enterprises
        SET industry_type = '数字服务', city_name = '昆明市', province_name = '云南省',
            reporting_frequency_rule = 'Q1_HALF_MONTH_OTHER_MONTHLY'
        WHERE id = 1
        """
    )
    cursor.execute(
        """
        UPDATE employment_records
        SET report_type = 'monthly', report_period = '2026-04', workflow_status = 'city_pending', submitted_by = 2
        WHERE id = 1
        """
    )
    cursor.execute(
        """
        UPDATE unemployment_records
        SET report_type = 'monthly', report_period = '2026-04', workflow_status = 'city_pending', submitted_by = 2
        WHERE id = 1
        """
    )

    connection.commit()
    connection.close()

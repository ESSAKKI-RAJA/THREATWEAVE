import os
import psycopg2
import pandas as pd
import numpy as np
import datetime
from dotenv import load_dotenv

load_dotenv()

def get_db_connection():
    from app.core.config import get_settings
    settings = get_settings()
    db_url = settings.DATABASE_URL
    if settings.ENV.upper() != "LOCAL" and "sslmode" not in db_url:
        separator = "&" if "?" in db_url else "?"
        db_url = f"{db_url}{separator}sslmode=require"
    return psycopg2.connect(db_url)

def generate_history():
    print("Connecting to database...")
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Get all vendors
        cursor.execute("SELECT id, risk_score FROM vendors")
        vendors = cursor.fetchall()
        
        if not vendors:
            print("No vendors found to generate history for.")
            return

        end_date = datetime.date.today()
        start_date = end_date - datetime.timedelta(days=365)
        
        for vendor_id, current_risk in vendors:
            print(f"Generating synthetic history for vendor {vendor_id}...")
            if current_risk is None:
                current_risk = 50.0

            # Delete existing history for this vendor
            cursor.execute(f"DELETE FROM vendor_risk_history WHERE vendor_id = '{vendor_id}'")
            cursor.execute(f"DELETE FROM vendor_features WHERE vendor_id = '{vendor_id}'")
            
            history_records = []
            features_records = []
            
            # Start risk 365 days ago, random walk towards current
            sim_risk = max(0, min(100, current_risk + np.random.normal(0, 10)))
            
            for i in range(365):
                curr_date = start_date + datetime.timedelta(days=i)
                
                # Drift slightly towards the current_risk over the year
                drift = (current_risk - sim_risk) / (365 - i)
                sim_risk = max(0, min(100, sim_risk + drift + np.random.normal(0, 1)))
                
                # Synthetic features
                exp_count = int(max(0, sim_risk / 10 + np.random.normal(0, 2)))
                vuln_count = int(max(0, sim_risk / 5 + np.random.normal(0, 5)))
                epss_avg = max(0.01, min(0.99, (sim_risk / 100) * 0.8 + np.random.normal(0, 0.1)))
                port_count = int(max(1, exp_count * 1.5))
                kev_count = int(max(0, vuln_count * 0.1))
                rep_score = max(0, sim_risk - 20)
                
                history_records.append((vendor_id, curr_date.isoformat(), float(sim_risk), exp_count, vuln_count, float(epss_avg), port_count))
                features_records.append((vendor_id, curr_date.isoformat(), float(sim_risk), exp_count, vuln_count, float(epss_avg), port_count, kev_count, float(rep_score)))

            # Bulk insert
            from psycopg2.extras import execute_values
            
            execute_values(
                cursor,
                "INSERT INTO vendor_risk_history (vendor_id, snapshot_date, risk_score, exposure_count, vulnerability_count, epss_avg, port_count) VALUES %s",
                history_records
            )
            execute_values(
                cursor,
                "INSERT INTO vendor_features (vendor_id, feature_date, risk_score, exposure_count, vuln_count, epss_avg, port_count, kev_count, reputation_score) VALUES %s",
                features_records
            )
            
            conn.commit()
            print(f"Generated 365 days of history for vendor {vendor_id}")
            
    except Exception as e:
        print(f"Error generating history: {e}")
    finally:
        if 'conn' in locals():
            conn.close()

if __name__ == "__main__":
    generate_history()

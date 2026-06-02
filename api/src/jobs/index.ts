import { CronJob } from "cron";
import { assignOrdersToShippers, sendCurrentOrderToShipper } from "./order.job";
import { isDatabaseReachable } from "../utils/db-health";

let dbUnavailableLogged = false;

export function startJobs() {
	const runJobs = async () => {
		if (!(await isDatabaseReachable())) {
			if (!dbUnavailableLogged) {
				console.warn(
					"[jobs] PostgreSQL inaccessible (localhost:5432). " +
						"Démarrez la base : depuis la racine du projet → docker compose up -d db"
				);
				dbUnavailableLogged = true;
			}
			return;
		}

		dbUnavailableLogged = false;

		try {
			await assignOrdersToShippers();
			await sendCurrentOrderToShipper();
		} catch (error) {
			console.error("Error running jobs:", error);
		}
	};

	const job = new CronJob("*/10 * * * * *", runJobs);
	job.start();
}

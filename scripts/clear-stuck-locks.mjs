import "dotenv/config";
import pg from "pg";

const connectionString = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
const client = new pg.Client({ connectionString });

async function main() {
  await client.connect();
  const result = await client.query(`
    SELECT pg_terminate_backend(pid) AS terminated, pid
    FROM pg_stat_activity
    WHERE datname = current_database() AND pid <> pg_backend_pid()
  `);
  console.log(`Terminated ${result.rowCount} lingering connection(s).`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await client.end();
  });

import { useTaskRepo } from "./repositories/task.repository.js";
import { useStudentRepo } from "./repositories/student.repository.js";

export default async function setup() {
  const { createTaskIndexes } = useTaskRepo();
  try {
    const message = await createTaskIndexes();
    console.log(message);
  } catch (error) {
    console.error("Error creating indexes:", error.message);
  }

  const { createStudentIndexes } = useStudentRepo();
  try {
    const message = await createStudentIndexes();
    console.log(message);
  } catch (error) {
    console.error("Error creating indexes:", error.message);
  }
}

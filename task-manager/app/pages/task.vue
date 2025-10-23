<template>
  <v-row justify="center">
    <v-col cols="12">
      <!-- Title -->
      <v-toolbar flat color="blue-grey-lighten-5">
        <v-row justify="center" class="w-100">
          <v-col cols="12" class="text-center">
            <span class="text-h5 font-weight-bold">TASKS </span>
          </v-col>
        </v-row>
      </v-toolbar>

      <v-divider></v-divider>

      <!-- Card for Table -->
      <v-card variant="flat">
        <v-toolbar class="px-8" color="white">
          <v-text-field
            v-model="search"
            @keydown.enter="taskSearch()"
            placeholder="Search task"
            rounded="xl"
            density="compact"
            variant="outlined"
            class="flex-grow-0 w-25"
            prepend-inner-icon="mdi-magnify"
            hide-details
          >
          </v-text-field>

          <v-btn
            variant="flat"
            class="font-weight-bold ml-4"
            rounded="xl"
            color="blue-grey-lighten-1"
            @click="dialogTask = true"
          >
            Add Task
          </v-btn>
          <template #append>
            {{ pageRange }}
            <v-btn
              @click="prevPage()"
              fab
              icon
              :disabled="page === 1"
              class="ml-2"
              color="blue-grey-darken-4"
            >
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <v-btn
              @click="nextPage()"
              fab
              icon
              :disabled="page === pages"
              color="blue-grey-darken-4"
            >
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
          </template>
        </v-toolbar>

        <v-divider></v-divider>

        <v-data-table
          :headers="headersTask"
          :items="tasks"
          hide-default-footer
          hide-no-data
        >
          <template #item.actions="{ item }">
            <v-btn
              icon="mdi-pencil"
              variant="plain"
              color="blue-grey-darken-3"
              @click="selectTask(item, item._id)"
            ></v-btn>
            <v-btn
              icon="mdi-delete"
              variant="plain"
              color="blue-grey-darken-3"
              @click="selectToDelete(item._id), (dialogDeleteTask = true)"
            ></v-btn>
          </template>
        </v-data-table>
        <v-divider></v-divider>
      </v-card>

      <!-- Input Dialog -->
      <v-dialog v-model="dialogTask" width="auto" persistent>
        <v-card width="400">
          <v-toolbar color="blue-grey-lighten-5">
            <span class="text-h6 font-weight-bold px-5">
              {{ formTitle }}
            </span>
          </v-toolbar>

          <v-form v-model="valid" class="px-5">
            <v-row>
              <v-col class="my-5">
                <span>Task</span>
                <v-text-field
                  v-model="task"
                  variant="outlined"
                  density="compact"
                  :rules="[rules.required]"
                  @keydown.enter="submitTask()"
                >
                </v-text-field>

                <span>Description</span>
                <v-textarea
                  v-model="description"
                  variant="outlined"
                  density="compact"
                  rows="2"
                >
                </v-textarea>
              </v-col>
            </v-row>
          </v-form>

          <template v-slot:actions>
            <v-btn @click="(dialogTask = false), reset()">Cancel</v-btn>
            <v-btn @click="submitTask()" :disabled="!valid">Submit</v-btn>
          </template>
        </v-card>
      </v-dialog>

      <!-- Delete Dialog -->
      <v-dialog v-model="dialogDeleteTask" width="auto" persistent>
        <v-card width="400" text="Are you sure you want to delete this task?">
          <template v-slot:actions>
            <v-btn @click="dialogDeleteTask = false">No</v-btn>
            <v-btn @click="deleteTask(id), (dialogDeleteTask = false)"
              >Yes</v-btn
            >
          </template>
        </v-card>
      </v-dialog>
    </v-col>
  </v-row>
</template>

<script setup>
definePageMeta({
  middleware: "auth",
});

const tasks = ref([]);
const page = ref(1);
const pages = ref(0);
const pageRange = ref("-- - of --");
const search = ref("");

// fetch API
const { data: tasksReq, refresh: refreshTasks } = await useLazyAsyncData(
  "get-tasks" + page,
  () =>
    $fetch("/api/tasks", {
      query: { page: page.value, search: search.value },
    }),
  { watch: [page] }
);

watchEffect(() => {
  if (tasksReq.value) {
    tasks.value = tasksReq.value.items;
    pages.value = tasksReq.value.pages;
    pageRange.value = tasksReq.value.pageRange;
  }
});

function nextPage() {
  if (page.value < pages.value) {
    page.value += 1;
  }
}

function prevPage() {
  if (page.value > 1) {
    page.value -= 1;
  }
}

function taskSearch() {
  page.value = 1;
  refreshTasks();
}

const valid = ref(true);
const rules = { required: (value) => !!value || "Required" };

const task = ref("");
const description = ref("");
const id = ref(null);

const formTitle = ref("ADD TASK");
const dialogTask = ref(false);
const dialogDeleteTask = ref(false);
const headersTask = [
  {
    title: "Tasks",
    value: "task",
  },

  {
    title: "Description",
    value: "description",
  },
  {
    title: "",
    value: "actions",
    width: "200px",
    align: "end",
  },
];

function reset() {
  task.value = "";
  description.value = "";
  id.value = null;
  formTitle.value = "ADD TASK";
}

function selectToDelete(itemId = "") {
  id.value = itemId;
}

function selectTask(item, itemId) {
  id.value = itemId;
  task.value = item.task;
  description.value = item.description;
  formTitle.value = "EDIT TASK";
  dialogTask.value = true;
}

async function deleteTask(itemId) {
  try {
    await $fetch(`/api/tasks/${itemId}`, {
      method: "DELETE",
    });

    await refreshTasks();
  } catch (error) {
    console.log("Failed to delete task", error);
  }
}

async function addTask() {
  try {
    await $fetch("/api/tasks", {
      method: "POST",
      body: {
        task: task.value,
        description: description.value,
      },
    });

    await refreshTasks();
    reset();
  } catch (error) {
    console.log("Failed to add task", error);
  }
}

async function updateTask() {
  try {
    await $fetch(`/api/tasks/${id.value}`, {
      method: "PATCH",
      body: {
        task: task.value,
        description: description.value,
      },
    });

    await refreshTasks();
    reset();
  } catch (error) {
    console.log("Failed to update task", error);
  }
}

async function submitTask() {
  if (formTitle.value == "ADD TASK") {
    await addTask();
  }

  if (formTitle.value == "EDIT TASK") {
    await updateTask();
  }

  dialogTask.value = false;
  reset();
}
</script>

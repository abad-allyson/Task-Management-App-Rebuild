<template>
  <v-row justify="center">
    <v-col cols="12">
      <!-- Title -->
      <v-toolbar flat color="blue-grey-lighten-5">
        <v-row justify="center" class="w-100">
          <v-col cols="12" class="text-center">
            <span class="text-h5 font-weight-bold">STUDENTS</span>
          </v-col>
        </v-row>
      </v-toolbar>

      <v-divider></v-divider>

      <!-- Card for Table -->
      <v-card variant="flat">
        <v-toolbar class="px-8" color="white">
          <v-text-field
            v-model="search"
            @keydown.enter="studentSearch()"
            placeholder="Search student"
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
            rounded="xl"
            class="font-weight-bold ml-4"
            @click="dialogStudent = true"
            color="blue-grey-lighten-1"
          >
            Add Student
          </v-btn>

          <template #append>
            {{ pageRange }}
            <v-btn
              @click="prevPage()"
              fab
              icon
              :disabled="page === 1"
              color="blue-grey-darken-4"
              class="ml-2"
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
          :headers="headers"
          :items="students"
          hide-default-footer
          hide-no-data
        >
          <template #item.actions="{ item }">
            <v-btn
              icon="mdi-pencil"
              variant="plain"
              @click="selectStudent(item, item._id)"
            ></v-btn>
            <v-btn
              icon="mdi-delete"
              variant="plain"
              @click="selectToDelete(item._id), (dialogDeleteStudent = true)"
            ></v-btn>
          </template>
        </v-data-table>
        <v-divider></v-divider>
      </v-card>

      <!-- Input Dialog -->
      <v-dialog v-model="dialogStudent" width="auto" persistent>
        <v-card width="400">
          <v-toolbar color="blue-grey-lighten-5">
            <span class="text-h6 font-weight-bold px-5">
              {{ formTitle }}
            </span>
          </v-toolbar>

          <v-form v-model="valid" class="px-5">
            <v-row>
              <v-col class="my-5">
                <span>First Name</span>
                <v-text-field
                  v-model="firstName"
                  variant="outlined"
                  density="compact"
                  :rules="[rules.required]"
                  @keydown.enter="submitStudent()"
                >
                </v-text-field>
                <span>Middle Name</span>
                <v-text-field
                  v-model="middleName"
                  variant="outlined"
                  density="compact"
                  @keydown.enter="submitStudent()"
                >
                </v-text-field>
                <span>Last Name</span>
                <v-text-field
                  v-model="lastName"
                  variant="outlined"
                  density="compact"
                  :rules="[rules.required]"
                  @keydown.enter="submitStudent()"
                >
                </v-text-field>
                <span>Birthdate</span>
                <v-text-field
                  v-model="birthDate"
                  type="date"
                  variant="outlined"
                  density="compact"
                  :rules="[rules.required]"
                  @keydown.enter="submitStudent()"
                >
                </v-text-field>
                <span>Grade Level</span>
                <v-text-field
                  v-model="gradeLevel"
                  variant="outlined"
                  density="compact"
                  :rules="[rules.required]"
                  @keydown.enter="submitStudent()"
                >
                </v-text-field>
              </v-col>
            </v-row>
          </v-form>

          <template v-slot:actions>
            <v-btn @click="(dialogStudent = false), reset()">Cancel</v-btn>
            <v-btn @click="submitStudent()" :disabled="!valid">Submit</v-btn>
          </template>
        </v-card>
      </v-dialog>

      <!-- Delete Dialog -->
      <v-dialog v-model="dialogDeleteStudent" width="auto" persistent>
        <v-card
          width="400"
          text="Are you sure you want to delete this student?"
        >
          <template v-slot:actions>
            <v-btn @click="dialogDeleteStudent = false">No</v-btn>
            <v-btn @click="deleteStudent(id), (dialogDeleteStudent = false)"
              >Yes</v-btn
            >
          </template>
        </v-card>
      </v-dialog>
    </v-col>
  </v-row>
</template>

<script setup>
const page = ref(1);
const pages = ref(0);
const pageRange = ref("-- - of --");
const search = ref("");
const students = ref([]);

const { data: studentsReq, refresh: refreshStudents } = await useLazyAsyncData(
  "get-students" + page,
  () =>
    $fetch("/api/students", {
      query: { page: page.value, search: search.value },
    }),
  { watch: [page] }
);

watchEffect(() => {
  if (studentsReq.value) {
    students.value = studentsReq.value.items;
    pages.value = studentsReq.value.pages;
    pageRange.value = studentsReq.value.pageRange;
  }
});

function studentSearch() {
  page.value = 1;
  refreshStudents();
}

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

const valid = ref(true);
const rules = { required: (value) => !!value || "Required" };

const firstName = ref("");
const middleName = ref("");
const lastName = ref("");
const birthDate = ref("");
const gradeLevel = ref("");
const id = ref(null);

const formTitle = ref("ADD STUDENT");
const dialogStudent = ref(false);
const dialogDeleteStudent = ref(false);
const headers = [
  {
    title: "First Name",
    value: "firstName",
  },
  {
    title: "Middle Name",
    value: "middleName",
  },
  {
    title: "Last Name",
    value: "lastName",
  },
  {
    title: "Birthdate",
    value: "birthDate",
  },
  {
    title: "Grade Level",
    value: "gradeLevel",
  },
  {
    title: "",
    value: "actions",
    width: "200px",
    align: "end",
  },
];

function reset() {
  firstName.value = "";
  middleName.value = "";
  lastName.value = "";
  birthDate.value = "";
  gradeLevel.value = "";
  id.value = null;
  formTitle.value = "ADD STUDENT";
}

function selectStudent(item, itemId) {
  id.value = itemId;
  firstName.value = item.firstName;
  middleName.value = item.middleName;
  lastName.value = item.lastName;
  birthDate.value = item.birthDate;
  gradeLevel.value = item.gradeLevel;
  formTitle.value = "EDIT STUDENT";
  dialogStudent.value = true;
}

function selectToDelete(itemId = "") {
  id.value = itemId;
}

async function deleteStudent(itemId) {
  try {
    await $fetch(`/api/students/${itemId}`, {
      method: "DELETE",
    });

    await refreshStudents();
  } catch (error) {
    console.log("Failed to delete students", error);
  }
}

async function addStudent() {
  try {
    await $fetch("/api/students", {
      method: "POST",
      body: {
        firstName: firstName.value,
        middleName: middleName.value,
        lastName: lastName.value,
        birthDate: birthDate.value,
        gradeLevel: gradeLevel.value,
      },
    });

    await refreshStudents();
    reset();
  } catch (error) {
    console.log("Failed to add student", error);
  }
}

async function updateStudent() {
  try {
    await $fetch(`/api/students/${id.value}`, {
      method: "PATCH",
      body: {
        firstName: firstName.value,
        middleName: middleName.value,
        lastName: lastName.value,
        birthDate: birthDate.value,
        gradeLevel: gradeLevel.value,
      },
    });

    await refreshStudents();
    reset();
  } catch (error) {
    console.log("Failed to update students", error);
  }
}

function submitStudent() {
  if (formTitle.value == "ADD STUDENT") {
    addStudent();
  }

  if (formTitle.value == "EDIT STUDENT") {
    updateStudent();
  }

  dialogStudent.value = false;
  reset();
  console.log(students);
}
</script>

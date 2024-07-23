<template>
  <div class="container-fluid p-5">
    <div class="row">
      <div class="col-lg-12">
        <div class="card card-primary card-outline shadow">
          <div class="card-header">
            <div
              class="d-flex justify-content-between align-items-center flex-wrap"
            >
              <form
                id="search-form"
                class="d-flex flex-wrap align-items-center"
              >
                <div class="form-group me-2 mb-2">
                  <label for="title" class="visually-hidden"
                    >Search by title</label
                  >
                  <input
                    type="text"
                    class="form-control"
                    id="title"
                    placeholder="Search by title..."
                    name="title"
                    v-model="searchTitle"
                    @input="fetchTasks"
                  />
                </div>
              </form>
              <button
                type="button"
                class="btn btn-secondary"
                @click="viewTrashedTasks"
              >
                View Trashed Tasks
              </button>
              <AddTaskComponent
                @taskAdded="fetchTasks(pagination.current_page)"
              />
            </div>
          </div>

          <div class="card-body">
            <table class="table table-bordered table-striped">
              <thead class="thead-dark">
                <tr>
                  <th class="text-center">ID</th>
                  <th class="text-center">Title</th>
                  <th class="text-center">Description</th>
                  <th class="text-center">Status</th>
                  <th class="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="task in tasks" :key="task.id">
                  <td class="text-center">{{ task.id }}</td>
                  <td class="text-center">{{ task.title }}</td>
                  <td class="text-center">{{ task.description }}</td>
                  <td class="text-center">
                    <button
                      :class="buttonClass(task.status)"
                      @click="toggleStatus(task.id)"
                    >
                      {{ task.status === "pending" ? "Pending" : "Completed" }}
                    </button>
                  </td>
                  <td>
                    <EditTaskComponent
                      :task="task"
                      @taskUpdated="fetchTasks(pagination.current_page)"
                    />|
                    <DeleteTaskComponent
                      :task="task"
                      @taskUpdated="fetchTasks(pagination.current_page)"
                    />
                  </td>
                </tr>
              </tbody>
            </table>

            <nav
              aria-label="Page navigation example"
              v-if="pagination.total > 1"
            >
              <ul class="pagination justify-content-center">
                <li
                  class="page-item"
                  :class="{ disabled: !pagination.prev_page_url }"
                >
                  <a
                    class="page-link"
                    href="#"
                    @click.prevent="changePage(pagination.current_page - 1)"
                    >Previous</a
                  >
                </li>
                <li
                  class="page-item"
                  :class="{ active: pagination.current_page === pageNumber }"
                  v-for="pageNumber in pagination.last_page"
                  :key="pageNumber"
                >
                  <a
                    class="page-link"
                    href="#"
                    @click.prevent="changePage(pageNumber)"
                    >{{ pageNumber }}</a
                  >
                </li>
                <li
                  class="page-item"
                  :class="{ disabled: !pagination.next_page_url }"
                >
                  <a
                    class="page-link"
                    href="#"
                    @click.prevent="changePage(pagination.current_page + 1)"
                    >Next</a
                  >
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import AddTaskComponent from "./AddTaskComponent";
import EditTaskComponent from "./EditTaskComponent";
import DeleteTaskComponent from "./DeleteTaskComponent";


export default {
  name: "TaskComponent",
  components: {
    AddTaskComponent,
    EditTaskComponent,
    DeleteTaskComponent
  },
  data() {
    return {
      tasks: [],
      searchTitle: "",
      pagination: {
        current_page: 1,
        last_page: 1,
        prev_page_url: null,
        next_page_url: null,
        total: 0,
      },
    };
  },
  mounted() {
    this.fetchTasks();
  },
  methods: {
    async fetchTasks(page = 1) {
      try {
        const response = await axios.get("http://localhost:8000/api/tasks", {
          params: {
            page,
            title: this.searchTitle,
          },
        });
        this.tasks = response.data.data.data;
        this.pagination = response.data.data;
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    },
    async toggleStatus(taskId) {
      try {
        await axios.post(
          `http://localhost:8000/api/tasks/toggle-status/${taskId}`
        );
        this.fetchTasks(this.pagination.current_page);
      } catch (error) {
        console.error("Error toggling status:", error);
      }
    },
    buttonClass(status) {
      return status === "pending" ? "btn btn-success" : "btn btn-secondary";
    },
    changePage(page) {
      if (
        page !== this.pagination.current_page &&
        page > 0 &&
        page <= this.pagination.last_page
      ) {
        this.fetchTasks(page);
      }
    },
    viewTrashedTasks() {
      window.location.href = "/tasks/trashed";
    },
  },
};
</script>

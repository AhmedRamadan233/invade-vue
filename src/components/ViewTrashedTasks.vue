<template>
  <div class="container-fluid p-5">
    <div class="row">
      <div class="col-lg-12">
        <div class="card card-primary card-outline shadow">
          <div class="card-header">
            <h3 class="card-title">Trashed Tasks</h3>
          </div>
          <div class="card-body">
            <table class="table table-bordered table-striped">
              <thead class="thead-dark">
                <tr>
                  <th class="text-center">ID</th>
                  <th class="text-center">Title</th>
                  <th class="text-center">Description</th>
                  <th class="text-center">Status</th>
                  <th class="text-center">Deleted At</th>
                  <th class="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="task in tasks" :key="task.id">
                  <td class="text-center">{{ task.id }}</td>
                  <td class="text-center">{{ task.title }}</td>
                  <td class="text-center">{{ task.description }}</td>
                  <td class="text-center">{{ task.status }}</td>
                  <td class="text-center">{{ formatDate(task.deleted_at) }}</td>
                  <td class="text-center">
                    <restore-task-component
                      :task="task"
                      @taskUpdated="fetchTasks"
                    />
                    <force-delete-task-component
                      :task="task"
                      @taskUpdated="fetchTasks"
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
                  >
                    Previous
                  </a>
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
                  >
                    {{ pageNumber }}
                  </a>
                </li>
                <li
                  class="page-item"
                  :class="{ disabled: !pagination.next_page_url }"
                >
                  <a
                    class="page-link"
                    href="#"
                    @click.prevent="changePage(pagination.current_page + 1)"
                  >
                    Next
                  </a>
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
import axios from "../axios";
import RestoreTaskComponent from "./RestoreTaskComponent.vue";
import ForceDeleteTaskComponent from "./ForceDeleteTaskComponent.vue";
export default {
  name: "ViewTrashedTasks",
  components: {
    RestoreTaskComponent,
    ForceDeleteTaskComponent,
  },
  data() {
    return {
      tasks: [],
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
        const response = await axios.get(
          "http://localhost:8000/api/tasks/trashed",
          {
            params: {
              page,
            },
          }
        );
        this.tasks = response.data.data.data;
        this.pagination = response.data.data;
      } catch (error) {
        console.error("Error fetching trashed tasks:", error);
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString();
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
  },
};
</script>

<style scoped></style>

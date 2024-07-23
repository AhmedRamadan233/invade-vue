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
                    @input="fetchCategories"
                  />
                </div>
              </form>
              <AddCategoryComponent @categoryAdded="fetchCategories" />
            </div>
          </div>
          <div class="card-body">
            <table class="table table-bordered table-striped">
              <thead class="thead-dark">
                <tr>
                  <th class="text-center">ID</th>
                  <th class="text-center">Name</th>
                  <th class="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="category in categories" :key="category?.id">
                  <td class="text-center">{{ category?.id }}</td>
                  <td class="text-center">{{ category?.name }}</td>
                  <td>
                    <EditCategoryComponent
                      :category="category"
                      @categoryUpdated="
                        fetchCategories(pagination.current_page)
                      "
                    />
                    |
                    <DeleteCategoryComponent
                      :category="category"
                      @categoryUpdated="
                        fetchCategories(pagination.current_page)
                      "
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
import axiosInstance from "../axios";
import AddCategoryComponent from "./AddCategoryComponent.vue";
import DeleteCategoryComponent from "./DeleteCategoryComponent.vue";
import EditCategoryComponent from "./EditCategoryComponent.vue";

export default {
  name: "CategoryComponent",
  components: {
    AddCategoryComponent,
    EditCategoryComponent,
    DeleteCategoryComponent,
  },
  data() {
    return {
      categories: [],
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
    this.fetchCategories();
  },
  methods: {
    async fetchCategories(page = 1) {
      try {
        const response = await axiosInstance.get(
          "http://localhost:8000/api/categories",
          {
            params: {
              page,
              search: this.searchTitle,
            },
          }
        );
        this.categories = response.data.data.data || []; // Default to empty array if no data
        this.pagination = {
          current_page: response.data.data.current_page || 1,
          last_page: response.data.data.last_page || 1,
          prev_page_url: response.data.data.prev_page_url || null,
          next_page_url: response.data.data.next_page_url || null,
          total: response.data.data.total || 0,
        };
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    },
    changePage(page) {
      if (
        page !== this.pagination.current_page &&
        page > 0 &&
        page <= this.pagination.last_page
      ) {
        this.fetchCategories(page);
      }
    },
  },
};
</script>

<style scoped></style>

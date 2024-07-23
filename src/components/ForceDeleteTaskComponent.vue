<template>
    <div>
      <!-- Force Delete Button -->
      <button
        type="button"
        class="btn btn-danger"
        data-bs-toggle="modal"
        :data-bs-target="`#forceDeleteTaskModal${task.id}`"
      >
        Force Delete Task
      </button>
  
      <!-- Force Delete Modal -->
      <div
        class="modal fade"
        :id="`forceDeleteTaskModal${task.id}`"
        tabindex="-1"
        aria-labelledby="modalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="modalLabel">Force Delete Task</h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <p>Are you sure you want to force delete this task?</p>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                class="btn btn-danger"
                @click="forceDeleteTask"
              >
                Force Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { Modal } from "bootstrap";
  import axiosInstance from "../axios";
  
  export default {
    name: "ForceDeleteTaskComponent",
    props: {
      task: {
        type: Object,
        required: true,
      },
    },
    methods: {
      async forceDeleteTask() {
        try {
          const response = await axiosInstance.delete(`/tasks/force-delete/${this.task.id}`);
          if (response.data.success) {
            this.$emit("taskUpdated");
            const modalElement = document.getElementById(`forceDeleteTaskModal${this.task.id}`);
            const modalInstance = Modal.getInstance(modalElement);
            if (modalInstance) {
              modalInstance.hide();
            } else {
              new Modal(modalElement).hide();
            }
            alert(response.data.message); 
          }
        } catch (error) {
          console.error("Error force deleting task:", error);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .invalid-feedback {
    display: block;
  }
  </style>
  
let sortConditions = [];
document.addEventListener('DOMContentLoaded', function () {
    // Активный филиал
    window.currentBranchId = null;
   
  const urlParams = new URLSearchParams(window.location.search);
  urlParams.forEach((value, key) => {
    const element = document.querySelector(`[name="${key}"]`);
    if (element) element.value = value;
  });
  
    // Обработчик клика на филиал
    document.querySelectorAll('.branch-card').forEach(card => {
      card.addEventListener('click', (e) => {
        document.querySelectorAll('.branch-card').forEach(c => c.classList.remove('active'));
        e.currentTarget.classList.add('active');
        const branchId = e.currentTarget.getAttribute('onclick')?.match(/\d+/)?.[0];
        if (branchId) {
          window.currentBranchId = parseInt(branchId);
          document.getElementById('employee-table').dataset.branchId = branchId;
        }
      });
    }); 
  
    // Обработчик открытия модального окна "Добавить сотрудника"
    document.getElementById('addEmployeeModal').addEventListener('show.bs.modal', function (event) {
      if (!window.currentBranchId) {
        alert('Выберите филиал, в который хотите добавить сотрудника');
        event.preventDefault(); 
        return;
      }
      document.getElementById('branchId').value = window.currentBranchId;
    });
  });
  //Создание сотрудника
  document.getElementById('addEmployeeForm').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const formData = {
      branchId: currentBranchId,
      fullName: e.target.elements.fullName.value,
      positionId: e.target.elements.positionId.value,
      salary: parseFloat(e.target.elements.salary.value),
      birthDate: e.target.elements.birthDate.value,
      hireDate: e.target.elements.hireDate.value
    };
  
    try {
      const response = await fetch('/branches/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
  
      const result = await response.json();
  
      if (response.ok) {
        // Закрываем модальное окно через Bootstrap API
        bootstrap.Modal.getInstance(document.getElementById('addEmployeeModal')).hide();
        e.target.reset();
        await loadEmployees(currentBranchId); // Перезагружаем список
        alert('Сотрудник успешно добавлен!');
      } else {
        throw new Error(result.message || 'Ошибка сервера');
      }
    } catch (error) {
      console.error('Ошибка:', error);
      alert(`Ошибка при сохранении: ${error.message}`);
    }
  });
  
  // Редактирование сотрудника(открытие модальной формы и ajax-запрос)
  function openEditEmployeeModal(employee) {
    document.getElementById('employeeId').value = employee.id;
    document.getElementById('editFullName').value = employee.fullName;
    document.getElementById('editPositionId').value = employee.positionId; 
    console.log(document.getElementById('editFullName').value = employee.fullName)
    document.getElementById('editSalary').value = employee.salary;
    document.getElementById('editBirthDate').value = new Date(employee.birthDate).toISOString().split('T')[0];
    document.getElementById('editHireDate').value = new Date(employee.hireDate).toISOString().split('T')[0];
    new bootstrap.Modal(document.getElementById('editEmployeeModal')).show();
  }
  
  document.getElementById('editEmployeeForm').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const formData = {
      id: document.getElementById('employeeId').value,
      fullName: document.getElementById('editFullName').value,
      positionId: document.getElementById('editPositionId').value,
      salary: document.getElementById('editSalary').value,
      birthDate: document.getElementById('editBirthDate').value,
      hireDate: document.getElementById('editHireDate').value
    };
  
    try {
      const response = await fetch(`/branches/employees/${formData.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
  
      const result = await response.json();
  
      if (response.ok) {
        bootstrap.Modal.getInstance(document.getElementById('editEmployeeModal')).hide();
        alert('Сотрудник обновлён');
        await loadEmployees(window.currentBranchId);
      } else {
        throw new Error(result.message || 'Ошибка обновления сотрудника');
      }
    } catch (error) {
      console.error('Ошибка:', error);
      alert(`Ошибка: ${error.message}`);
    }
  });
  
  //Удаление сотрудника
  async function deleteEmployee(employeeId, buttonElement) {
    if (!confirm('Вы уверены, что хотите удалить сотрудника?')) return;
  
    try {
      const response = await fetch(`/branches/employees/${employeeId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });
  
      const result = await response.json();
      
      if (response.ok) {
        // Анимация удаления строки
        const row = buttonElement.closest('tr');
        row.animate([
          { opacity: 1, transform: 'translateX(0)' },
          { opacity: 0, transform: 'translateX(100px)' }
        ], {
          duration: 300,
          easing: 'ease-out'
        }).onfinish = () => row.remove();
        
        alert(result.message || 'Сотрудник успешно удалён');
      } else {
        throw new Error(result.message || 'Ошибка удаления');
      }
    } catch (error) {
      console.error('Ошибка:', error);
      alert(`Не удалось удалить сотрудника: ${error.message}`);
    }
  }
    
 

  
    // Загрузка сотрудников по филиалу
   async function loadEmployees(branchId) {
  try {
    let url = `/branches/${branchId}/employees`;
    const params = new URLSearchParams();

    // Добавляем параметры сортировки
    if (sortConditions.length > 0) {
      params.append('sort', sortConditions
        .map(condition => `${condition.field}:${condition.order.toUpperCase()}`)
        .join(','));
    }

    const formData = new FormData(document.getElementById('filterForm'));
    for (const [key, value] of formData.entries()) {
      if (value) params.append(key, value);
    }

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await fetch(url);
    if (!response.ok) throw new Error('Ошибка загрузки сотрудников');

    const employees = await response.json();
    const tableBody = document.querySelector('#employee-table tbody');
    tableBody.innerHTML = '';

    employees.forEach(emp => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${emp.fullName}</td>
        <td>${emp.positionName}</td>
        <td>${emp.salary}</td>
        <td>${new Date(emp.birthDate).toLocaleDateString()}</td>
        <td>${new Date(emp.hireDate).toLocaleDateString()}</td>
        <td class="action-col">
          <button class="btn btn-sm btn-warning me-1" onclick="openEditEmployeeModal(${JSON.stringify(emp).replace(/"/g, '&quot;')})">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-sm btn-danger" onclick="deleteEmployee(${emp.id},this)">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error('Ошибка:', error);
    alert('Не удалось загрузить сотрудников');
  }
}
document.getElementById('toggleFilters').addEventListener('click', () => {
  new bootstrap.Collapse(document.getElementById('filtersCollapse'), { toggle: true });
});

document.getElementById('filterForm').addEventListener('submit', function(e) {
  e.preventDefault();
  applyFilters();
});

function applyFilters() {
  const branchId = document.querySelector('#employee-table').dataset.branchId;
  if (branchId) loadEmployees(branchId);
}

function resetFilters() {
  document.getElementById('filterForm').reset();
  applyFilters();
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
  
});
    function updateSortIcons() {
      // Сначала сбрасываем все иконки
      document.querySelectorAll('.sort-btn').forEach(btn => {
        btn.innerHTML = '<i class="fas fa-sort"></i>';
      });
    
      // Теперь добавляем активные иконки
      sortConditions.forEach((condition, index) => {
        const btn = document.querySelector(`.sort-btn[data-sort="${condition.field}"]`);
        if (btn) {
          // Добавляем номер приоритета сортировки (опционально)
          const priority = index + 1;
          btn.innerHTML = `
            <span class="sort-indicator">${priority}</span>
            <i class="fas ${condition.order === 'asc' ? 'fa-sort-up' : 'fa-sort-down'}"></i>
          `;
        }
      });
    }
    document.querySelectorAll('.sort-btn').forEach(button => {
      button.addEventListener('click', () => {
        const field = button.getAttribute('data-sort');
        const existingIndex = sortConditions.findIndex(c => c.field === field);
    
        if (existingIndex > -1) {
         
          const currentOrder = sortConditions[existingIndex].order;
    
          if (currentOrder === 'asc') {
           
            sortConditions[existingIndex].order = 'desc';
          } else {
           
            sortConditions.splice(existingIndex, 1);
          }
        } else {
          
          sortConditions.push({ field, order: 'asc' });
        }
    
     
        updateSortIcons();
    
        const branchId = document.querySelector('#employee-table').dataset.branchId;
        loadEmployees(branchId);
      });
    });

    // Филиалы(дерево офисов)


    // Инициализация модальных окон
    document.addEventListener('DOMContentLoaded', function () {
      var addChildModal = document.getElementById('addChildBranchModal');
      if (addChildModal) {
        addChildModal.addEventListener('show.bs.modal', function (event) {
          var button = event.relatedTarget;
          var parentId = button.getAttribute('data-parent-id');
          var parentIdInput = this.querySelector('input[name="parentId"]');
          if (parentIdInput) {
            parentIdInput.value = parentId;
          }
        });
      }
  
      var editModal = document.getElementById('editBranchModal');
      if (editModal) {
        editModal.addEventListener('show.bs.modal', function (event) {
          var button = event.relatedTarget;
          var branchId = button.getAttribute('data-branch-id');
          var branchName = button.getAttribute('data-branch-name');
          var nameInput = this.querySelector('#branchName');
          nameInput.value = branchName;
          this.querySelector('form').action = `/branches/${branchId}`;
        });
      }
    });
  

    // Анимация переключения веток
    function toggleBranch(element) {
      const icon = element.querySelector('i');
      const childrenContainer = element.closest('.branch-node').querySelector('.node-children');
      if (childrenContainer.style.display === 'none') {
        childrenContainer.style.display = 'block';
        icon.classList.replace('fa-chevron-right', 'fa-chevron-down');
      } else {
        childrenContainer.style.display = 'none';
        icon.classList.replace('fa-chevron-down', 'fa-chevron-right');
      }
    }
  
    // Улучшенная функция удаления с анимацией
    async function deleteBranch(branchId) {
    if (!confirm('Удалить филиал и все дочерние подразделения (включая сотрудников)?')) return;

    try {
        const response = await fetch(`/branches/${branchId}`, { method: 'DELETE' });

        if (response.ok) {
            // Успешный ответ (2xx)
            const branchNode = document.querySelector(`[data-branch-id="${branchId}"]`)?.closest('.branch-node');
            if (branchNode) {
                branchNode.animate([
                    { opacity: 1, transform: 'translateX(0)' },
                    { opacity: 0, transform: 'translateX(50px)' }
                ], { duration: 300 }).onfinish = () => branchNode.remove();
            }
        } else {
            const errorData = await response.json();
            alert(`Ошибка: ${errorData.message || 'Неизвестная ошибка'}`);
        }
    } catch (error) {
        console.error('Ошибка сети:', error);
        alert('Произошла ошибка при удалении филиала.');
    }
}
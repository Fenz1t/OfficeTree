// components/Tour.jsx
import { useEffect, useRef } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const Tour = () => {
  const driverRef = useRef(null);
  useEffect(() => {
    if (driverRef.current) {
      driverRef.current.destroy();
      driverRef.current = null;
    }

    driverRef.current = driver({
      showProgress: true,
      animate: true,
      opacity: 0.75,
      padding: 10,
      allowClose: true,
      overlayClickNext: false,
      doneBtnText: "Завершить",
      closeBtnText: "Закрыть",
      nextBtnText: "Далее",
      prevBtnText: "Назад",
      onDestroyed: () => {
        driverRef.current = null;
      },
    });

    const steps = [
      {
        element: '[data-tour="office-tree"]',
        popover: {
          title: "Дерево филиалов",
          description:
            "Здесь отображается иерархия всех филиалов компании. Выберите филиал, чтобы увидеть его сотрудников.",
          position: "right",
        },
      },
      {
        element: '[data-tour="create-office"]',
        popover: {
          title: "Создание филиала",
          description:
            "Нажмите эту кнопку, чтобы добавить новый филиал или подразделение.",
          position: "bottom",
        },
      },
      {
        element: '[data-tour="delete-office"]',
        popover: {
          title: "Удаление филиала",
          description: "Выберите из списка офисов, которой хотите удалить.",
          position: "bottom",
        },
      },
      {
        element: '[data-tour="employees-table"]',
        popover: {
          title: "Таблица сотрудников",
          description: "Здесь отображаются все сотрудники выбранного филиала.С помощью колонок можно сортировать сотрудников а также фильтровать по разным критериям",
          position: "left",
        },
      },
      {
        element: '[data-tour="create-employee"]',
        popover: {
          title: "Добавление сотрудника",
          description:
            "Нажмите эту кнопку, чтобы добавить нового сотрудника в выбранный филиал.",
          position: "bottom",
        },
      },
      {
        element: '[data-tour="edit-employee"]',
        popover: {
          title: "Редактирование сотрудника",
          description:
            "Нажав на эту кнопку откроется форма редактирования сотрудника",
          position: "top",
        },
      },
       {
        element: '[data-tour="delete-employee"]',
        popover: {
          title: "Удаление сотрудника",
          description:
          "Нажав на эту кнопку вы удаляете сотрудника",
          position: "top",
        },
      },
    ];
    driverRef.current.setSteps(steps);
    driverRef.current.drive();

    return () => {
      if (driverRef.current) {
        driverRef.current.destroy();
      }
    };
  }, []);
};

export default Tour;

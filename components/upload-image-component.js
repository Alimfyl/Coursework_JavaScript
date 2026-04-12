import { uploadImage } from '../api.js';

/**
 * Компонент загрузки изображения.
 * Этот компонент позволяет пользователю загружать изображение и отображать его превью.
 * Если изображение уже загружено, пользователь может заменить его.
 *
 * @param {HTMLElement} params.element - HTML-элемент, в который будет рендериться компонент.
 * @param {Function} params.onImageUrlChange - Функция, вызываемая при изменении URL изображения.
 *                                            Принимает один аргумент - новый URL изображения или пустую строку.
 */
export function renderUploadImageComponent({ element, onImageUrlChange }) {
  /**
   * URL текущего изображения.
   * Изначально пуст, пока пользователь не загрузит изображение.
   * @type {string}
   */
  let imageUrl = '';

  /**
   * Функция рендеринга компонента.
   * Отображает интерфейс компонента в зависимости от состояния:
   * либо форма выбора файла, либо превью загруженного изображения с кнопкой замены.
   */
  const render = () => {
    element.innerHTML = `
      <div class="upload-image">
        ${
          imageUrl
            ? `
            <div class="file-upload-image-container">
              <img 
                class="file-upload-image" 
                src="${imageUrl}" 
                alt="Загруженное изображение"
                loading="lazy"
                onerror="this.onerror=null;this.src='./assets/images/default-post.jpg';"
              >
              <button class="file-upload-remove-button button" type="button">Заменить фото</button>
            </div>
            `
            : `
            <label class="file-upload-label secondary-button">
              <input
                type="file"
                class="file-upload-input"
                style="display:none"
              />
              Выберите фото
            </label>
          `
        }
      </div>
    `;

    // Обработчик выбора файла
    const fileInputElement = element.querySelector('.file-upload-input');

    fileInputElement?.addEventListener('change', () => {
      const file = fileInputElement.files[0];
      if (file) {
        const labelEl = element.querySelector('.file-upload-label');
        labelEl.textContent = 'Загружаю файл...';
        labelEl.style.pointerEvents = 'none';

        // Загружаем изображение с помощью API
        uploadImage({ file })
          .then(({ fileUrl }) => {
            imageUrl = fileUrl; // Сохраняем URL загруженного изображения
            onImageUrlChange(imageUrl); // Уведомляем о изменении URL изображения
            render(); // Перерисовываем компонент с новым состоянием
          })
          .catch((error) => {
            console.error('Ошибка загрузки:', error);
            alert('Не удалось загрузить фото');
            render(); // Возвращаем в исходное состояние при ошибке
          });
      }
    });

    // Обработчик удаления изображения
    element
      .querySelector('.file-upload-remove-button')
      ?.addEventListener('click', () => {
        imageUrl = ''; // Сбрасываем URL изображения
        onImageUrlChange(imageUrl); // Уведомляем об изменении URL изображения
        render(); // Перерисовываем компонент
      });
  };

  // Инициализация компонента
  render();
}

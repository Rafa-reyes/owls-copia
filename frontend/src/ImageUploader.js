// src/ImageUploader.js

export class ImageUploader {
    /**
     * @param {Object} config - Configuración de los IDs del HTML
     */
    constructor(config) {
        this.dom = {
            dropZone: document.getElementById(config.dropZoneId),
            inputFile: document.getElementById(config.inputId),
            previewImage: document.getElementById(config.previewImageId),
            previewContainer: document.getElementById(config.previewContainerId),
            removeBtn: document.getElementById(config.removeBtnId),
            errorText: document.getElementById(config.errorId),
            textHint: document.getElementById(config.textContainerId)
        };
        
        // Límites estrictos definidos en tu regla
        this.maxBytes = 5 * 1024 * 1024; // 5 MB en bytes
        this.allowedTypes = ['image/jpeg', 'image/png']; // Solo JPG y PNG
        
        this.base64Data = null;

        // Solo inicializa los eventos si encontró el contenedor en el HTML
        if (this.dom.dropZone) {
            this.bindEvents();
        }
    }

    bindEvents() {
        // Eventos de arrastrar y soltar (Drag & Drop)
        this.dom.dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.dom.dropZone.classList.add('border-teal-500', 'bg-teal-50', 'dark:bg-teal-900');
        });

        this.dom.dropZone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            this.dom.dropZone.classList.remove('border-teal-500', 'bg-teal-50', 'dark:bg-teal-900');
        });

        this.dom.dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            this.dom.dropZone.classList.remove('border-teal-500', 'bg-teal-50', 'dark:bg-teal-900');
            if (e.dataTransfer.files.length > 0) {
                this.procesarArchivo(e.dataTransfer.files[0]);
            }
        });

        // Evento de clic normal
        this.dom.inputFile.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.procesarArchivo(e.target.files[0]);
            }
        });

        // Evento para quitar la imagen
        if (this.dom.removeBtn) {
            this.dom.removeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation(); 
                this.limpiar();
            });
        }
    }

    procesarArchivo(file) {
        this.ocultarError();

        // 1. Validación de Formato (Solo PNG y JPG)
        if (!this.allowedTypes.includes(file.type)) {
            this.mostrarError('Formato inválido. Solo se admiten archivos PNG o JPG.');
            return;
        }

        // 2. Validación de Peso (Máximo 5MB)
        if (file.size > this.maxBytes) {
            const currentMB = (file.size / (1024 * 1024)).toFixed(2);
            this.mostrarError(`El archivo pesa ${currentMB}MB. El límite máximo es 5MB.`);
            return;
        }

        // 3. Conversión a Base64
        const reader = new FileReader();
        reader.onload = (e) => {
            this.base64Data = e.target.result;
            this.mostrarVistaPrevia(this.base64Data);
        };
        reader.onerror = () => {
            this.mostrarError('Ocurrió un error de lectura en el navegador.');
        };
        reader.readAsDataURL(file);
    }

    mostrarVistaPrevia(src) {
        if (this.dom.previewImage) this.dom.previewImage.src = src;
        if (this.dom.previewContainer) this.dom.previewContainer.classList.remove('hidden');
        if (this.dom.textHint) this.dom.textHint.classList.add('hidden');
        if (this.dom.inputFile) this.dom.inputFile.classList.add('hidden'); 
    }

    limpiar() {
        if (this.dom.inputFile) this.dom.inputFile.value = '';
        this.base64Data = null;
        
        if (this.dom.previewImage) this.dom.previewImage.src = '';
        if (this.dom.previewContainer) this.dom.previewContainer.classList.add('hidden');
        if (this.dom.textHint) this.dom.textHint.classList.remove('hidden');
        if (this.dom.inputFile) this.dom.inputFile.classList.remove('hidden');
        
        this.ocultarError();
    }

    mostrarError(mensaje) {
        if (this.dom.errorText) {
            this.dom.errorText.textContent = mensaje;
            this.dom.errorText.classList.remove('hidden');
        }
        this.limpiar(); 
    }

    ocultarError() {
        if (this.dom.errorText) {
            this.dom.errorText.classList.add('hidden');
            this.dom.errorText.textContent = '';
        }
    }

    /** Retorna el Base64 de la imagen o null si está vacío */
    getBase64() {
        return this.base64Data;
    }
}
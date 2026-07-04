/**
 * LatexTailor v2.0.0 - Motor de Patronaje y Simulador 3D Interactivo
 */

// 1. DEFINICIÓN Y METADATOS DE LAS 28 MEDIDAS CORPORALES (De acuerdo al gráfico del usuario)
const MEASUREMENTS_DEF = [
    { id: 1,  key: "gender",       label: "Género / Sexo (Gender)", group: "general", min: 1, max: 2, step: 1, defaultVal: 1, unit: "tipo" }, // 1: Mujer, 2: Hombre
    { id: 2,  key: "weight",       label: "Peso Corporal (Weight)", group: "general", min: 40, max: 130, step: 0.5, defaultVal: 62, unit: "kg" },
    { id: 3,  key: "height",       label: "Estatura / Altura (Height)", group: "general", min: 140, max: 210, step: 1, defaultVal: 165, unit: "cm" },
    { id: 4,  key: "headCircum",   label: "Contorno Cabeza (Head around)", group: "cabeza", min: 48, max: 64, step: 0.5, defaultVal: 55, unit: "cm" },
    { id: 5,  key: "headLength",   label: "Altura de Cabeza (Head length)", group: "cabeza", min: 18, max: 32, step: 0.5, defaultVal: 23, unit: "cm" },
    { id: 6,  key: "neckCircum",   label: "Contorno de Cuello (Neck around)", group: "cabeza", min: 28, max: 48, step: 0.5, defaultVal: 33, unit: "cm" },
    { id: 7,  key: "neckLength",   label: "Largo de Cuello (Neck length)", group: "cabeza", min: 4, max: 12, step: 0.2, defaultVal: 7, unit: "cm" },
    { id: 8,  key: "shoulderLen",  label: "Ancho Hombros (Shoulder length)", group: "torso", min: 32, max: 52, step: 0.5, defaultVal: 38, unit: "cm" },
    { id: 9,  key: "armpitCircum", label: "Axila / Pecho Superior (Armpit around)", group: "torso", min: 75, max: 125, step: 0.5, defaultVal: 88, unit: "cm" },
    { id: 10, key: "bustCircum",   label: "Contorno de Busto (Breast/Bust)", group: "torso", min: 70, max: 130, step: 1, defaultVal: 90, unit: "cm" },
    { id: 11, key: "waistCircum",  label: "Contorno de Cintura (Waist around)", group: "torso", min: 50, max: 120, step: 1, defaultVal: 68, unit: "cm" },
    { id: 12, key: "hipCircum",    label: "Contorno de Cadera (Hip around)", group: "torso", min: 70, max: 130, step: 1, defaultVal: 95, unit: "cm" },
    { id: 13, key: "thighCircum",  label: "Contorno de Muslo (Thigh around)", group: "pierna", min: 38, max: 74, step: 0.5, defaultVal: 54, unit: "cm" },
    { id: 14, key: "kneeCircum",   label: "Contorno de Rodilla (Knee around)", group: "pierna", min: 28, max: 48, step: 0.5, defaultVal: 36, unit: "cm" },
    { id: 15, key: "shankCircum",  label: "Contorno Pantorrilla (Shank around)", group: "pierna", min: 26, max: 48, step: 0.5, defaultVal: 34, unit: "cm" },
    { id: 16, key: "ankleCircum",  label: "Contorno de Tobillo (Ankle around)", group: "pierna", min: 16, max: 28, step: 0.5, defaultVal: 22, unit: "cm" },
    { id: 17, key: "footLength",   label: "Largo del Pie (Foot length)", group: "pierna", min: 20, max: 32, step: 0.5, defaultVal: 24, unit: "cm" },
    { id: 18, key: "kneeToAnkle",  label: "Largo Rodilla a Tobillo", group: "pierna", min: 30, max: 55, step: 1, defaultVal: 38, unit: "cm" },
    { id: 19, key: "legLength",    label: "Largo Pierna Interno (Leg length)", group: "pierna", min: 55, max: 95, step: 1, defaultVal: 72, unit: "cm" },
    { id: 20, key: "upperArm",     label: "Contorno Bíceps (Upper Arm around)", group: "brazo", min: 20, max: 45, step: 0.5, defaultVal: 28, unit: "cm" },
    { id: 21, key: "elbowCircum",  label: "Contorno de Codo (Elbow around)", group: "brazo", min: 18, max: 38, step: 0.5, defaultVal: 24, unit: "cm" },
    { id: 22, key: "forearmCircum",label: "Contorno Antebrazo (Antebrachium)", group: "brazo", min: 16, max: 36, step: 0.5, defaultVal: 22, unit: "cm" },
    { id: 23, key: "wristCircum",  label: "Contorno de Muñeca (Wrist around)", group: "brazo", min: 11, max: 24, step: 0.5, defaultVal: 16, unit: "cm" },
    { id: 24, key: "armLength",    label: "Largo de Brazo (Arm length)", group: "brazo", min: 45, max: 75, step: 1, defaultVal: 56, unit: "cm" },
    { id: 25, key: "handLength",   label: "Largo Mano (Wrist to finger)", group: "brazo", min: 14, max: 25, step: 0.5, defaultVal: 18, unit: "cm" },
    { id: 26, key: "ubend",        label: "Tiro Completo U-Bend (Gusset loop)", group: "torso", min: 110, max: 200, step: 1, defaultVal: 150, unit: "cm" },
    { id: 27, key: "neckToWaist",  label: "Talle Cuello a Cintura (Front)", group: "torso", min: 30, max: 60, step: 0.5, defaultVal: 42, unit: "cm" },
    { id: 28, key: "waistToAnkle", label: "Largo Cintura a Tobillo (Side)", group: "pierna", min: 80, max: 125, step: 1, defaultVal: 98, unit: "cm" }
];

// 2. BASE DE DATOS DE TALLAS PREESTABLECIDAS COMPLETAS (28 PUNTOS)
const EXTENDED_SIZE_DATABASE = {
    female: {
        xs:  [1, 48, 155, 52, 21, 30, 6.0, 34, 78,  80,  58,  85,  46, 32, 30, 19, 22.0, 34, 66, 24, 21, 19, 14.0, 50, 16.0, 136, 38,  90],
        s:   [1, 54, 160, 53, 22, 31.5, 6.5, 36, 83,  85,  62,  90,  50, 34, 32, 20.5, 23.0, 36, 69, 26, 22.5, 20.5, 15.0, 53, 17.0, 143, 40,  94],
        m:   [1, 62, 165, 55, 23, 33, 7.0, 38, 88,  90,  68,  95,  54, 36, 34, 22, 24.0, 38, 72, 28, 24, 22, 16.0, 56, 18.0, 150, 42,  98],
        l:   [1, 70, 170, 56, 24, 35, 7.5, 40, 94,  96,  74,  101, 58, 38, 36, 23.5, 25.0, 40, 75, 30, 25.5, 23.5, 17.0, 59, 19.0, 157, 44,  102],
        xl:  [1, 78, 175, 58, 25, 37, 8.0, 42, 100, 102, 80,  107, 62, 40, 38, 25, 26.0, 42, 78, 32, 27, 25, 18.0, 62, 20.0, 164, 46,  106],
        xxl: [1, 86, 180, 59, 26, 39, 8.5, 44, 106, 108, 86,  113, 66, 42, 40, 26.5, 27.0, 44, 81, 34, 28.5, 26.5, 19.0, 65, 21.0, 171, 48,  110]
    },
    male: {
        xs:  [2, 58, 165, 53, 22, 34, 6.5, 38, 84,  88,  70,  88,  48, 33, 31, 20, 23.5, 36, 70, 27, 23, 21, 15.0, 53, 17.5, 146, 41,  94],
        s:   [2, 66, 170, 54, 23, 35.5, 7.0, 40, 89,  92,  74,  92,  51, 35, 33, 21.5, 24.5, 38, 73, 29, 24.5, 22.5, 16.0, 56, 18.5, 153, 43,  98],
        m:   [2, 74, 175, 56, 24, 37, 7.5, 42, 94,  96,  80,  96,  55, 37, 35, 23, 25.5, 40, 76, 31, 26, 24, 17.0, 59, 19.5, 160, 45,  102],
        l:   [2, 82, 180, 57, 25, 39, 8.0, 44, 100, 102, 86,  102, 59, 39, 37, 24.5, 26.5, 42, 79, 33, 27.5, 25.5, 18.0, 62, 20.5, 167, 47,  106],
        xl:  [2, 90, 185, 59, 26, 41, 8.5, 46, 106, 108, 92,  108, 63, 41, 39, 26, 27.5, 44, 82, 35, 29, 27, 19.0, 65, 21.5, 174, 49,  110],
        xxl: [2, 98, 190, 60, 27, 43, 9.0, 48, 112, 114, 98,  114, 67, 43, 41, 27.5, 28.5, 46, 85, 37, 30.5, 28.5, 20.0, 68, 22.5, 181, 51,  114]
    }
};

// 3. ESTADO GENERAL DE LA APLICACIÓN
let state = {
    garment: "body",
    gender: "female",
    sizePreset: "m",
    thickness: 0.40,
    tension: "tight",
    seamAllowance: 8, // mm
    measurements: {}, // Llave -> Valor cm
    activeMeasureId: null, // ID enfocado (1-28)
    zoom: 0.8,
    panX: 0,
    panY: 0,
    isDragging: false,
    startX: 0,
    startY: 0,
    showGrid: true,
    viewMode: "pattern", // "pattern" or "3d-sim"
    renderMode: "vector", // "vector" or "real"
    rotationAngle: 35, // Ángulo 3D por defecto
    currentColor: "black" // Color de filtro de látex fotorrealista
};

// 4. ELEMENTOS DEL DOM
const sizePresetSelect = document.getElementById("size-preset");
const latexThicknessInput = document.getElementById("latex-thickness");
const thicknessVal = document.getElementById("thickness-val");
const tensionLevelSelect = document.getElementById("tension-level");
const seamAllowanceInput = document.getElementById("seam-allowance");
const seamVal = document.getElementById("seam-val");
const reductionBadge = document.getElementById("reduction-total-badge");
const measuresTableBody = document.getElementById("measures-table-body");
const canvasContainer = document.getElementById("canvas-container");
const interactiveBodySvgContainer = document.getElementById("interactive-body-svg-container");
const sim3dCanvasContainer = document.getElementById("sim-3d-canvas-container");
const rotationSlider = document.getElementById("rotation-slider");
const rotationAngleVal = document.getElementById("rotation-angle-val");

// 5. INICIALIZACIÓN
document.addEventListener("DOMContentLoaded", () => {
    loadSizePreset();
    renderInteractiveBodyDiagram();
    renderMeasuresTable();
    setupEventHandlers();
    updateZoomFactor(); // Sincroniza zoom de 80% inicial
    drawPattern();
    draw3DMannequin();
    updateCutList();
});

// Cargar medidas desde la base de datos de tallas extendida
function loadSizePreset() {
    if (state.sizePreset === "manual") return;
    const arrayValues = EXTENDED_SIZE_DATABASE[state.gender][state.sizePreset];
    
    MEASUREMENTS_DEF.forEach((def, index) => {
        state.measurements[def.key] = arrayValues[index];
    });
}

// 6. GENERAR EL DIAGRAMA DEL CUERPO HUMANO INTERACTIVO (SVG BLUEPRINT)
function renderInteractiveBodyDiagram() {
    // Dibujo del cuerpo humano vectorial — Rediseñado con proporciones reales basado en imagen de referencia
    const svgCode = `
        <svg viewBox="0 0 300 480" width="100%" height="100%" id="human-silhouette-svg">
            <defs>
                <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>
            
            <!-- ═══ CABEZA ═══ -->
            <ellipse cx="150" cy="30" rx="22" ry="26" class="body-outline-silhouette"/>
            
            <!-- ═══ CUERPO COMPLETO (silueta frontal con brazos y piernas separados) ═══ -->
            <path d="
                M 140 56
                Q 118 62, 72 78
                L 56 84
                Q 42 122, 36 160
                Q 30 198, 26 220
                L 24 228 L 22 236 L 32 236 L 34 228
                Q 38 202, 46 164
                Q 54 130, 64 94
                L 78 84
                Q 76 98, 80 110
                Q 86 128, 94 142
                Q 100 152, 100 160
                Q 94 175, 86 190
                Q 78 200, 78 212
                L 76 258
                Q 74 290, 72 318
                Q 70 358, 68 398
                L 66 428
                L 54 436 L 54 444 L 84 444 L 86 436
                L 88 398
                Q 92 358, 96 318
                Q 100 290, 104 258
                L 112 220
                Q 132 214, 150 212
                Q 168 214, 188 220
                L 196 258
                Q 200 290, 204 318
                Q 208 358, 212 398
                L 214 436
                L 216 444 L 246 444 L 246 436 L 234 428
                L 232 398
                Q 230 358, 228 318
                Q 226 290, 224 258
                L 222 212
                Q 222 200, 214 190
                Q 206 175, 200 160
                Q 200 152, 206 142
                Q 214 128, 220 110
                Q 224 98, 222 84
                L 236 94
                Q 246 130, 254 164
                Q 262 202, 266 228
                L 268 236 L 278 236 L 276 228 L 274 220
                Q 270 198, 264 160
                Q 258 122, 244 84
                L 228 78
                Q 182 62, 160 56
                Z
            " class="body-outline-silhouette"/>

            <!-- ═══════════════════════════════════════════════════════════ -->
            <!-- ═══ LÍNEAS DE MEDIDAS (las 28 medidas corporales) ═══ -->
            <!-- ═══════════════════════════════════════════════════════════ -->
            
            <!-- 3. Altura (Estatura) — línea vertical al lado derecho -->
            <line x1="280" y1="4" x2="280" y2="444" class="diagram-measure-line" id="diag-line-3"/>
            
            <!-- 4. Contorno Cabeza — elipse alrededor de la cabeza -->
            <ellipse cx="150" cy="30" rx="27" ry="31" fill="none" class="diagram-measure-line" id="diag-line-4"/>
            
            <!-- 5. Altura Cabeza — vertical junto a la cabeza -->
            <line x1="180" y1="4" x2="180" y2="56" class="diagram-measure-line" id="diag-line-5"/>

            <!-- 6. Contorno Cuello — horizontal en el cuello -->
            <line x1="136" y1="62" x2="164" y2="62" class="diagram-measure-line" id="diag-line-6"/>
            
            <!-- 7. Largo de Cuello — vertical corta al lado del cuello -->
            <line x1="172" y1="56" x2="172" y2="68" class="diagram-measure-line" id="diag-line-7"/>

            <!-- 8. Hombro a hombro — horizontal ancha en los hombros -->
            <line x1="72" y1="78" x2="228" y2="78" class="diagram-measure-line" id="diag-line-8"/>

            <!-- 9. Axila / Pecho Superior (Armpit around) — horizontal bajo axila -->
            <line x1="78" y1="88" x2="222" y2="88" class="diagram-measure-line" id="diag-line-9"/>

            <!-- 10. Contorno de Pecho / Busto — horizontal en el pecho -->
            <line x1="80" y1="110" x2="220" y2="110" class="diagram-measure-line" id="diag-line-10"/>

            <!-- 11. Contorno de Cintura — horizontal en la cintura -->
            <line x1="100" y1="160" x2="200" y2="160" class="diagram-measure-line" id="diag-line-11"/>

            <!-- 12. Contorno de Cadera — horizontal en las caderas -->
            <line x1="78" y1="200" x2="222" y2="200" class="diagram-measure-line" id="diag-line-12"/>

            <!-- 13. Contorno de Muslo — horizontal en el muslo izquierdo -->
            <line x1="76" y1="240" x2="112" y2="240" class="diagram-measure-line" id="diag-line-13"/>

            <!-- 14. Contorno de Rodilla — horizontal en la rodilla izquierda -->
            <line x1="72" y1="318" x2="96" y2="318" class="diagram-measure-line" id="diag-line-14"/>

            <!-- 15. Contorno Pantorrilla — horizontal en la pantorrilla izquierda -->
            <line x1="70" y1="368" x2="92" y2="368" class="diagram-measure-line" id="diag-line-15"/>

            <!-- 16. Contorno de Tobillo — horizontal en el tobillo izquierdo -->
            <line x1="68" y1="412" x2="88" y2="412" class="diagram-measure-line" id="diag-line-16"/>

            <!-- 17. Largo del Pie — horizontal en la base del pie izquierdo -->
            <line x1="54" y1="444" x2="84" y2="444" class="diagram-measure-line" id="diag-line-17"/>

            <!-- 18. Rodilla a Tobillo — vertical parcial en la pierna izquierda -->
            <line x1="68" y1="318" x2="66" y2="412" class="diagram-measure-line" id="diag-line-18"/>

            <!-- 19. Largo de Pierna — vertical interna desde entrepierna a tobillo -->
            <line x1="110" y1="212" x2="82" y2="412" class="diagram-measure-line" id="diag-line-19"/>

            <!-- 20. Contorno Bíceps — horizontal en el brazo superior izquierdo -->
            <line x1="60" y1="102" x2="76" y2="102" class="diagram-measure-line" id="diag-line-20"/>

            <!-- 21. Contorno Codo — horizontal en el codo izquierdo -->
            <line x1="48" y1="142" x2="64" y2="142" class="diagram-measure-line" id="diag-line-21"/>

            <!-- 22. Contorno Antebrazo — horizontal en el antebrazo izquierdo -->
            <line x1="42" y1="172" x2="58" y2="172" class="diagram-measure-line" id="diag-line-22"/>

            <!-- 23. Contorno de Muñeca — horizontal en la muñeca izquierda -->
            <line x1="32" y1="210" x2="48" y2="210" class="diagram-measure-line" id="diag-line-23"/>

            <!-- 24. Largo de Brazo — diagonal a lo largo del brazo izquierdo -->
            <line x1="72" y1="78" x2="30" y2="220" class="diagram-measure-line" id="diag-line-24"/>

            <!-- 25. Largo Mano — vertical corta en la zona de la mano izquierda -->
            <line x1="26" y1="220" x2="26" y2="236" class="diagram-measure-line" id="diag-line-25"/>

            <!-- 26. U-Bend (Tiro completo cuello-entrepierna-cuello) — curva en U -->
            <path d="M 150 62 Q 168 145 150 212 Q 132 145 150 62" fill="none" class="diagram-measure-line" id="diag-line-26"/>

            <!-- 27. Talle Cuello a Cintura — vertical central -->
            <line x1="150" y1="62" x2="150" y2="160" class="diagram-measure-line" id="diag-line-27"/>

            <!-- 28. Largo Cintura a Tobillo — diagonal lateral -->
            <line x1="150" y1="160" x2="82" y2="412" class="diagram-measure-line" id="diag-line-28"/>


            <!-- ═══════════════════════════════════════════════ -->
            <!-- ═══ NODOS NUMÉRICOS INTERACTIVOS (1-28) ═══ -->
            <!-- ═══════════════════════════════════════════════ -->
            <g id="diagram-nodes-group">
                <!-- 3. Altura -->
                <circle cx="280" cy="224" r="8" class="diagram-node-circle" data-id="3"/>
                <text x="280" y="228" class="diagram-node-text">3</text>

                <!-- 4. Contorno Cabeza -->
                <circle cx="150" cy="0" r="8" class="diagram-node-circle" data-id="4"/>
                <text x="150" y="4" class="diagram-node-text">4</text>

                <!-- 5. Altura Cabeza -->
                <circle cx="180" cy="30" r="7" class="diagram-node-circle" data-id="5"/>
                <text x="180" y="34" class="diagram-node-text">5</text>

                <!-- 6. Contorno Cuello -->
                <circle cx="150" cy="62" r="7" class="diagram-node-circle" data-id="6"/>
                <text x="150" y="66" class="diagram-node-text">6</text>

                <!-- 7. Largo Cuello -->
                <circle cx="172" cy="62" r="6" class="diagram-node-circle" data-id="7"/>
                <text x="172" y="66" class="diagram-node-text">7</text>

                <!-- 8. Hombro a hombro -->
                <circle cx="50" cy="78" r="8" class="diagram-node-circle" data-id="8"/>
                <text x="50" y="82" class="diagram-node-text">8</text>

                <!-- 9. Axila -->
                <circle cx="56" cy="88" r="7" class="diagram-node-circle" data-id="9"/>
                <text x="56" y="92" class="diagram-node-text">9</text>

                <!-- 10. Busto -->
                <circle cx="62" cy="110" r="8" class="diagram-node-circle" data-id="10"/>
                <text x="62" y="114" class="diagram-node-text">10</text>

                <!-- 11. Cintura -->
                <circle cx="86" cy="160" r="8" class="diagram-node-circle" data-id="11"/>
                <text x="86" y="164" class="diagram-node-text">11</text>

                <!-- 12. Cadera -->
                <circle cx="62" cy="200" r="8" class="diagram-node-circle" data-id="12"/>
                <text x="62" y="204" class="diagram-node-text">12</text>

                <!-- 13. Muslo -->
                <circle cx="94" cy="240" r="8" class="diagram-node-circle" data-id="13"/>
                <text x="94" y="244" class="diagram-node-text">13</text>

                <!-- 14. Rodilla -->
                <circle cx="84" cy="318" r="8" class="diagram-node-circle" data-id="14"/>
                <text x="84" y="322" class="diagram-node-text">14</text>

                <!-- 15. Pantorrilla -->
                <circle cx="81" cy="368" r="8" class="diagram-node-circle" data-id="15"/>
                <text x="81" y="372" class="diagram-node-text">15</text>

                <!-- 16. Tobillo -->
                <circle cx="78" cy="412" r="7" class="diagram-node-circle" data-id="16"/>
                <text x="78" y="416" class="diagram-node-text">16</text>

                <!-- 17. Pie -->
                <circle cx="69" cy="453" r="7" class="diagram-node-circle" data-id="17"/>
                <text x="69" y="457" class="diagram-node-text">17</text>

                <!-- 18. Rodilla a Tobillo -->
                <circle cx="57" cy="365" r="7" class="diagram-node-circle" data-id="18"/>
                <text x="57" y="369" class="diagram-node-text">18</text>

                <!-- 19. Largo Pierna -->
                <circle cx="100" cy="312" r="8" class="diagram-node-circle" data-id="19"/>
                <text x="100" y="316" class="diagram-node-text">19</text>

                <!-- 20. Bíceps -->
                <circle cx="50" cy="102" r="8" class="diagram-node-circle" data-id="20"/>
                <text x="50" y="106" class="diagram-node-text">20</text>

                <!-- 21. Codo -->
                <circle cx="40" cy="142" r="8" class="diagram-node-circle" data-id="21"/>
                <text x="40" y="146" class="diagram-node-text">21</text>

                <!-- 22. Antebrazo -->
                <circle cx="34" cy="172" r="7" class="diagram-node-circle" data-id="22"/>
                <text x="34" y="176" class="diagram-node-text">22</text>

                <!-- 23. Muñeca -->
                <circle cx="24" cy="210" r="7" class="diagram-node-circle" data-id="23"/>
                <text x="24" y="214" class="diagram-node-text">23</text>

                <!-- 24. Largo Brazo -->
                <circle cx="44" cy="150" r="8" class="diagram-node-circle" data-id="24"/>
                <text x="44" y="154" class="diagram-node-text">24</text>

                <!-- 25. Largo Mano -->
                <circle cx="18" cy="228" r="7" class="diagram-node-circle" data-id="25"/>
                <text x="18" y="232" class="diagram-node-text">25</text>

                <!-- 26. U-Bend -->
                <circle cx="168" cy="138" r="8" class="diagram-node-circle" data-id="26"/>
                <text x="168" y="142" class="diagram-node-text">26</text>

                <!-- 27. Cuello a Cintura -->
                <circle cx="160" cy="110" r="8" class="diagram-node-circle" data-id="27"/>
                <text x="160" y="114" class="diagram-node-text">27</text>

                <!-- 28. Cintura a Tobillo -->
                <circle cx="116" cy="286" r="8" class="diagram-node-circle" data-id="28"/>
                <text x="116" y="290" class="diagram-node-text">28</text>
            </g>
        </svg>
    `;
    
    interactiveBodySvgContainer.innerHTML = svgCode;

    // Agregar manejadores de clics y hovers a los nodos del SVG
    document.querySelectorAll(".diagram-node-circle").forEach(circle => {
        const id = parseInt(circle.dataset.id);
        
        circle.addEventListener("mouseenter", () => highlightMeasurement(id));
        circle.addEventListener("mouseleave", () => unhighlightMeasurement());
        
        circle.addEventListener("click", () => {
            const input = document.getElementById(`measure-input-${id}`);
            if (input) {
                input.focus();
                input.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        });
    });
}

// 7. RENDERIZAR TABLA DE MEDIDAS (1 A 28)
function renderMeasuresTable() {
    measuresTableBody.innerHTML = "";

    MEASUREMENTS_DEF.forEach(def => {
        const val = state.measurements[def.key];
        const row = document.createElement("tr");
        row.id = `measure-row-${def.id}`;
        
        row.innerHTML = `
            <td class="no-col">${def.id}</td>
            <td>
                <strong>${def.label}</strong>
            </td>
            <td>
                ${def.key === "gender" ? `
                    <select id="measure-input-1" style="width:100%; padding:0.2rem;">
                        <option value="1" ${val === 1 ? 'selected' : ''}>Mujer</option>
                        <option value="2" ${val === 2 ? 'selected' : ''}>Hombre</option>
                    </select>
                ` : `
                    <input type="number" id="measure-input-${def.id}" min="${def.min}" max="${def.max}" step="${def.step}" value="${val}">
                `}
            </td>
        `;

        measuresTableBody.appendChild(row);

        // Eventos para el input
        if (def.key === "gender") {
            const select = row.querySelector("select");
            select.addEventListener("change", (e) => {
                const newGender = e.target.value == 1 ? "female" : "male";
                setActiveGender(newGender);
            });
        } else {
            const input = row.querySelector("input");
            
            // Vincular foco con el diagrama SVG
            input.addEventListener("focus", () => {
                highlightMeasurement(def.id);
                // Resaltar la fila en la tabla
                row.classList.add("active-row");
            });

            input.addEventListener("blur", () => {
                unhighlightMeasurement();
                row.classList.remove("active-row");
            });

            input.addEventListener("input", (e) => {
                const newVal = parseFloat(e.target.value) || def.defaultVal;
                state.measurements[def.key] = newVal;
                
                // Si cambia el valor, forzar que la talla sea manual
                if (state.sizePreset !== "manual") {
                    state.sizePreset = "manual";
                    sizePresetSelect.value = "manual";
                }
                
                drawPattern();
                draw3DMannequin();
            });
        }
    });
}

// 8. LÓGICA DE RESALTADO INTERACTIVO
function highlightMeasurement(id) {
    state.activeMeasureId = id;
    
    // Desactivar previos
    document.querySelectorAll(".diagram-measure-line").forEach(l => l.classList.remove("active"));
    document.querySelectorAll(".diagram-node-circle").forEach(c => c.classList.remove("active"));
    document.querySelectorAll(".measures-table tbody tr").forEach(r => r.classList.remove("active-row"));

    // Activar en SVG
    const line = document.getElementById(`diag-line-${id}`);
    if (line) line.classList.add("active");
    
    const node = document.querySelector(`.diagram-node-circle[data-id="${id}"]`);
    if (node) node.classList.add("active");

    // Activar en la tabla
    const row = document.getElementById(`measure-row-${id}`);
    if (row) row.classList.add("active-row");
}

function unhighlightMeasurement() {
    state.activeMeasureId = null;
    document.querySelectorAll(".diagram-measure-line").forEach(l => l.classList.remove("active"));
    document.querySelectorAll(".diagram-node-circle").forEach(c => c.classList.remove("active"));
    document.querySelectorAll(".measures-table tbody tr").forEach(r => r.classList.remove("active-row"));
}

// 9. CONFIGURAR MANEJADORES DE EVENTOS GENERALES
function setupEventHandlers() {
    // Pestañas del Visualizador (Patrón CAD vs 3D)
    document.querySelectorAll(".view-tab").forEach(tab => {
        tab.addEventListener("click", (e) => {
            document.querySelectorAll(".view-tab").forEach(t => t.classList.remove("active"));
            e.target.classList.add("active");
            state.viewMode = e.target.dataset.view;

            if (state.viewMode === "pattern") {
                document.getElementById("pane-pattern-view").classList.add("active");
                document.getElementById("pane-3d-view").classList.remove("active");
                document.getElementById("pattern-actions").classList.remove("hidden");
                document.getElementById("sim-3d-actions").classList.add("hidden");
                drawPattern();
            } else {
                document.getElementById("pane-pattern-view").classList.remove("active");
                document.getElementById("pane-3d-view").classList.add("active");
                document.getElementById("pattern-actions").classList.add("hidden");
                document.getElementById("sim-3d-actions").classList.remove("hidden");
                draw3DMannequin();
            }
        });
    });

    // Cambiar prenda
    document.querySelectorAll(".garment-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            document.querySelectorAll(".garment-btn").forEach(b => b.classList.remove("active"));
            e.currentTarget.classList.add("active");
            state.garment = e.currentTarget.dataset.garment;

            if (state.sizePreset !== "manual") {
                loadSizePreset();
                renderMeasuresTable();
            }

            drawPattern();
            draw3DMannequin();
            updateCutList();
        });
    });

    // Sim mode toggles
    document.getElementById("sim-mode-vector").addEventListener("click", () => setSimMode("vector"));
    document.getElementById("sim-mode-real").addEventListener("click", () => setSimMode("real"));

    // Gender toggle buttons (already added)
    document.getElementById("gender-female").addEventListener("click", () => setActiveGender("female"));
    document.getElementById("gender-male").addEventListener("click", () => setActiveGender("male"));

    // Size Preset toggle
    sizePresetSelect.addEventListener("change", (e) => {
        state.sizePreset = e.target.value;
        if (state.sizePreset !== "manual") {
            loadSizePreset();
            renderMeasuresTable();
        }
        drawPattern();
        draw3DMannequin();
        updateCutList();
    });

    // Propiedades de Látex
    latexThicknessInput.addEventListener("input", (e) => {
        state.thickness = parseFloat(e.target.value);
        thicknessVal.textContent = state.thickness.toFixed(2) + " mm";
        updateReductionBadge();
        drawPattern();
        draw3DMannequin();
    });

    tensionLevelSelect.addEventListener("change", (e) => {
        state.tension = e.target.value;
        updateReductionBadge();
        drawPattern();
        draw3DMannequin();
    });

    seamAllowanceInput.addEventListener("input", (e) => {
        state.seamAllowance = parseInt(e.target.value);
        seamVal.textContent = state.seamAllowance + " mm";
        drawPattern();
    });

    // Manual tabs
    document.querySelectorAll(".manual-tab").forEach(tab => {
        tab.addEventListener("click", (e) => {
            document.querySelectorAll(".manual-tab").forEach(t => t.classList.remove("active"));
            document.querySelectorAll(".tab-pane").forEach(p => p.classList.remove("active"));
            e.target.classList.add("active");
            document.getElementById(`tab-${e.target.dataset.tab}`).classList.add("active");
        });
    });

    // Zoom & Pan
    document.getElementById("zoom-in").addEventListener("click", () => {
        state.zoom = Math.min(state.zoom + 0.15, 3.0);
        updateZoomFactor();
        drawPattern();
    });

    document.getElementById("zoom-out").addEventListener("click", () => {
        state.zoom = Math.max(state.zoom - 0.15, 0.2);
        updateZoomFactor();
        drawPattern();
    });

    document.getElementById("btn-reset-view").addEventListener("click", () => {
        state.zoom = 0.8;
        state.panX = 0;
        state.panY = 0;
        updateZoomFactor();
        drawPattern();
    });

    document.getElementById("btn-toggle-grid").addEventListener("click", () => {
        state.showGrid = !state.showGrid;
        drawPattern();
    });

    document.getElementById("btn-export").addEventListener("click", exportSVGPattern);

    // Zoom-dragging
    canvasContainer.addEventListener("mousedown", (e) => {
        state.isDragging = true;
        state.startX = e.clientX - state.panX;
        state.startY = e.clientY - state.panY;
    });

    window.addEventListener("mousemove", (e) => {
        if (!state.isDragging) return;
        state.panX = e.clientX - state.startX;
        state.panY = e.clientY - state.startY;
        
        const group = canvasContainer.querySelector("svg g#transform-group");
        if (group) {
            group.setAttribute("transform", `translate(${state.panX}, ${state.panY}) scale(${state.zoom})`);
        }
    });

    window.addEventListener("mouseup", () => {
        state.isDragging = false;
    });

    // Rotación del Maniquí 3D
    rotationSlider.addEventListener("input", (e) => {
        state.rotationAngle = parseInt(e.target.value);
        rotationAngleVal.textContent = state.rotationAngle + "°";
        draw3DMannequin();
    });

    // Arrastrar en el canvas 3D para rotar
    let is3dDragging = false;
    let start3dX = 0;
    sim3dCanvasContainer.addEventListener("mousedown", (e) => {
        is3dDragging = true;
        start3dX = e.clientX;
    });

    window.addEventListener("mousemove", (e) => {
        if (!is3dDragging) return;
        const deltaX = e.clientX - start3dX;
        start3dX = e.clientX;
        
        // Ajustar ángulo
        state.rotationAngle = (state.rotationAngle + Math.round(deltaX * 0.5)) % 360;
        if (state.rotationAngle < 0) state.rotationAngle += 360;
        
        rotationSlider.value = state.rotationAngle;
        rotationAngleVal.textContent = state.rotationAngle + "°";
        draw3DMannequin();
    });

    window.addEventListener("mouseup", () => {
        is3dDragging = false;
    });

    // Manejador de selección de color de látex fotorrealista
    document.querySelectorAll(".color-chip").forEach(chip => {
        chip.addEventListener("click", (e) => {
            document.querySelectorAll(".color-chip").forEach(c => c.classList.remove("active"));
            e.currentTarget.classList.add("active");
            state.currentColor = e.currentTarget.dataset.color;
            
            const img = document.querySelector(".sim-real-image-el");
            if (img) {
                img.className = `sim-real-image-el latex-color-${state.currentColor}`;
            }
        });
    });
}

function setSimMode(mode) {
    state.renderMode = mode;
    const vectorBtn = document.getElementById("sim-mode-vector");
    const realBtn = document.getElementById("sim-mode-real");
    const realContainer = document.getElementById("sim-real-image-container");
    
    if (mode === "vector") {
        vectorBtn.classList.add("active");
        realBtn.classList.remove("active");
        sim3dCanvasContainer.classList.remove("hidden");
        realContainer.classList.add("hidden");
    } else {
        realBtn.classList.add("active");
        vectorBtn.classList.remove("active");
        sim3dCanvasContainer.classList.add("hidden");
        realContainer.classList.remove("hidden");
        renderPhotorealisticView();
    }
    draw3DMannequin();
}

function renderPhotorealisticView() {
    const realContainer = document.getElementById("sim-real-image-container");
    const viewAngle = (state.rotationAngle >= 90 && state.rotationAngle < 270) ? "back" : "front";
    
    let garmentPrefix = state.garment;
    if (state.garment === "body") garmentPrefix = state.gender === "female" ? "body" : "catsuit";
    
    const imageName = `${state.gender}_${garmentPrefix}_${viewAngle}.png`;
    const imagePath = `assets/${imageName}`;
    const colorClass = `latex-color-${state.currentColor || 'black'}`;
    
    realContainer.innerHTML = `
        <div class="loader-real-sim">Cargando textura de látex fotorrealista...</div>
        <img src="${imagePath}" class="sim-real-image-el ${colorClass}" style="opacity: 0;" onload="this.style.opacity=1; this.previousElementSibling.style.display='none'" onerror="this.previousElementSibling.textContent='Imagen no disponible para este ángulo/prenda'; this.style.display='none'">
    `;
}

function setActiveGender(gender) {
    state.gender = gender;
    
    const femaleBtn = document.getElementById("gender-female");
    const maleBtn = document.getElementById("gender-male");
    
    if (gender === "female") {
        femaleBtn.classList.add("active");
        maleBtn.classList.remove("active");
    } else {
        femaleBtn.classList.remove("active");
        maleBtn.classList.add("active");
    }

    if (state.sizePreset !== "manual") {
        loadSizePreset();
    } else {
        // En manual, invertimos solo el género y recalculamos
        state.measurements["gender"] = gender === "female" ? 1 : 2;
    }
    
    renderMeasuresTable();
    drawPattern();
    draw3DMannequin();
}

function updateZoomFactor() {
    document.getElementById("zoom-factor").textContent = Math.round(state.zoom * 100) + "%";
}

function getReductionFactor() {
    let baseTension = 0.08;
    if (state.tension === "comfort") baseTension = 0.04;
    if (state.tension === "secondskin") baseTension = 0.12;

    let thicknessFactor = 1.0;
    if (state.thickness > 0.40) {
        thicknessFactor = 1.0 - ((state.thickness - 0.40) * 1.2);
    } else if (state.thickness < 0.40) {
        thicknessFactor = 1.0 + ((0.40 - state.thickness) * 0.8);
    }
    
    return Math.max(0.02, Math.min(0.20, baseTension * thicknessFactor));
}

function updateReductionBadge() {
    const factor = getReductionFactor();
    const percent = -(factor * 100).toFixed(1);
    reductionBadge.textContent = percent + "%";
}

// 10. GENERADOR DE PATRONES 2D (DISEÑO FÍSICO DE PRENDAS)
function drawPattern() {
    const reduction = 1 - getReductionFactor();
    const seam = state.seamAllowance * 1.5; 
    
    // Medidas ya reducidas
    const m = {};
    for (let key in state.measurements) {
        m[key] = state.measurements[key] * reduction;
    }
    
    let svgWidth = 800;
    let svgHeight = 650;
    let pathsHtml = "";
    
    // Grid de fondo
    let gridHtml = "";
    if (state.showGrid) {
        gridHtml = `<defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" class="svg-grid-main" stroke-width="1"/>
                <path d="M 10 0 L 10 50 M 20 0 L 20 50 M 30 0 L 30 50 M 40 0 L 40 50 M 0 10 L 50 10 M 0 20 L 50 20 M 0 30 L 50 30 M 0 40 L 50 40" fill="none" class="svg-grid-sub" stroke-width="0.5"/>
            </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />`;
    }

    // Dibujar patrón
    switch (state.garment) {
        case "body":
            pathsHtml = drawBodyPattern(m, seam);
            break;
        case "catsuit":
            pathsHtml = drawCatsuitPattern(m, seam);
            break;
        case "mask":
            pathsHtml = drawMaskPattern(m, seam);
            break;
        case "gloves":
            pathsHtml = drawGlovesPattern(m, seam);
            break;
        case "sosten":
            pathsHtml = drawBraPattern(m, seam);
            break;
        case "colaless":
            pathsHtml = drawColalessPattern(m, seam);
            break;
        case "boxer":
            pathsHtml = drawBoxerPattern(m, seam);
            break;
        case "stockings":
            pathsHtml = drawStockingsPattern(m, seam);
            break;
    }

    const svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 ${svgWidth} ${svgHeight}">
            ${gridHtml}
            <g id="transform-group" transform="translate(${state.panX}, ${state.panY}) scale(${state.zoom})">
                ${pathsHtml}
            </g>
        </svg>
    `;

    canvasContainer.innerHTML = svgContent;
}

// 2D CAD: SOSTÉN / BRA
function drawBraPattern(m, seam) {
    const bust = m.bustCircum || 90;
    const underbust = m.waistCircum || 68; // Cintura como aproximación de bajo busto
    
    // Proporciones del patrón de copa circular de látex (2 piezas: Copa Superior y Copa Inferior)
    const cupDiameter = (bust * 0.15) * 6.5; 
    const bandLength = (underbust * 0.4) * 8.0; 
    
    const cx = 150;
    const cy = 180;

    // Copa Superior (Crescent shape)
    const cupTopPath = `
        M ${cx} ${cy}
        A ${cupDiameter * 0.5} ${cupDiameter * 0.5} 0 0 1 ${cx + cupDiameter} ${cy}
        Q ${cx + cupDiameter * 0.5} ${cy + cupDiameter * 0.2} ${cx} ${cy}
        Z
    `;
    const cupTopSeam = `
        M ${cx - seam} ${cy}
        A ${cupDiameter * 0.5 + seam} ${cupDiameter * 0.5 + seam} 0 0 1 ${cx + cupDiameter + seam} ${cy}
        Q ${cx + cupDiameter * 0.5} ${cy + cupDiameter * 0.2 + seam} ${cx - seam} ${cy}
        Z
    `;

    // Copa Inferior (Base con pinza integrada)
    const bx = 150;
    const by = 280;
    const cupBotPath = `
        M ${bx} ${by}
        Q ${bx + cupDiameter * 0.25} ${by + cupDiameter * 0.25} ${bx + cupDiameter * 0.5} ${by + cupDiameter * 0.1}
        Q ${bx + cupDiameter * 0.75} ${by + cupDiameter * 0.25} ${bx + cupDiameter} ${by}
        A ${cupDiameter * 0.5} ${cupDiameter * 0.5} 0 0 1 ${bx} ${by}
        Z
    `;
    const cupBotSeam = `
        M ${bx - seam} ${by}
        Q ${bx + cupDiameter * 0.25} ${by + cupDiameter * 0.25 + seam} ${bx + cupDiameter * 0.5} ${by + cupDiameter * 0.1 + seam}
        Q ${bx + cupDiameter * 0.75} ${by + cupDiameter * 0.25 + seam} ${bx + cupDiameter + seam} ${by}
        A ${cupDiameter * 0.5 + seam} ${cupDiameter * 0.5 + seam} 0 0 1 ${bx - seam} ${by}
        Z
    `;

    // Tira de Contorno (Band)
    const tX = 460;
    const tY = 160;
    const bandPath = `
        M ${tX} ${tY}
        h ${bandLength}
        q 20 40 0 80
        h ${-bandLength}
        c ${-cupDiameter*0.3} ${-10} ${-cupDiameter*0.3} ${-70} 0 -80
        Z
    `;
    const bandSeam = `
        M ${tX - seam} ${tY - seam}
        h ${bandLength + seam * 2}
        q 20 40 0 80 + seam * 2
        h ${-(bandLength + seam * 2)}
        c ${-cupDiameter*0.3 - seam} ${-10} ${-cupDiameter*0.3 - seam} ${-70} 0 ${-80 - seam * 2}
        Z
    `;

    return `
        <!-- Copa Superior -->
        <path d="${cupTopSeam}" class="seam-allowance-outline" />
        <path d="${cupTopPath}" class="pattern-outline" />

        <!-- Copa Inferior -->
        <path d="${cupBotSeam}" class="seam-allowance-outline" />
        <path d="${cupBotPath}" class="pattern-outline" />

        <!-- Tira de Contorno -->
        <path d="${bandSeam}" class="seam-allowance-outline" />
        <path d="${bandPath}" class="pattern-outline" />

        <!-- Textos -->
        <text x="${cx + cupDiameter/2}" y="${cy - 20}" class="pattern-text-label">COPA SUPERIOR</text>
        <text x="${cx + cupDiameter/2}" y="${cy - 5}" class="pattern-text-desc">Cortar 2x (Espejo) Látex ${state.thickness}mm</text>

        <text x="${bx + cupDiameter/2}" y="${by + cupDiameter * 0.4}" class="pattern-text-label">COPA INFERIOR BASE</text>
        <text x="${bx + cupDiameter/2}" y="${by + cupDiameter * 0.4 + 15}" class="pattern-text-desc">Cortar 2x (Espejo)</text>

        <text x="${tX + bandLength/2}" y="${tY + 45}" class="pattern-text-label">BANDA CONTORNO</text>
        <text x="${tX + bandLength/2}" y="${tY + 60}" class="pattern-text-desc">Cortar 2x (Látex Grueso 0.50mm+)</text>
        <text x="${tX + bandLength/2}" y="${tY - 10}" class="pattern-dimension-text">Largo: ${(bandLength/8.0).toFixed(1)} cm</text>
    `;
}

// 2D CAD: COLALESS
function drawColalessPattern(m, seam) {
    const w = m.waistCircum || 68;
    const h = m.hipCircum || 95;
    const u = m.ubend || 150;

    const frontWaist = (w / 4) * 8.5;
    const backWaist = 18; // String muy estrecho en espalda
    const rise = (u * 0.14) * 7.5; 
    const crotch = 16; 

    const fx = 150;
    const fy = 100;

    // Delantero (Triángulo anatómico)
    const fPath = `
        M ${fx} ${fy}
        h ${frontWaist}
        c ${-frontWaist*0.1} ${rise*0.4} ${-frontWaist*0.5} ${rise*0.8} ${-frontWaist + crotch} ${rise}
        h ${-crotch}
        Z
    `;
    const fSeam = `
        M ${fx} ${fy - seam}
        h ${frontWaist + seam}
        c ${-frontWaist*0.1} ${rise*0.4} ${-frontWaist*0.5} ${rise*0.8} ${-frontWaist + crotch - seam} ${rise + seam}
        h ${-crotch - seam * 2}
        Z
    `;

    // Trasero (Colaless String)
    const bx = 480;
    const by = 100;
    const bPath = `
        M ${bx} ${by}
        h ${frontWaist}
        c ${-frontWaist*0.3} ${rise*0.5} ${-frontWaist*0.75} ${rise*0.8} ${-frontWaist + backWaist} ${rise}
        h ${-backWaist}
        Z
    `;
    const bSeam = `
        M ${bx} ${by - seam}
        h ${frontWaist + seam}
        c ${-frontWaist*0.3} ${rise*0.5} ${-frontWaist*0.75} ${rise*0.8} ${-frontWaist + backWaist - seam} ${rise + seam}
        h ${-backWaist - seam * 2}
        Z
    `;

    return `
        <!-- Delantero -->
        <path d="${fSeam}" class="seam-allowance-outline" />
        <path d="${fPath}" class="pattern-outline" />

        <!-- Trasero -->
        <path d="${bSeam}" class="seam-allowance-outline" />
        <path d="${bPath}" class="pattern-outline" />

        <!-- Textos -->
        <text x="${fx + frontWaist*0.5}" y="${fy + rise*0.4}" class="pattern-text-label">COLALESS FRONTAL</text>
        <text x="${fx + frontWaist*0.5}" y="${fy + rise*0.4 + 15}" class="pattern-text-desc">Cortar 1x al Doblez</text>

        <text x="${bx + frontWaist*0.5}" y="${by + rise*0.4}" class="pattern-text-label">COLALESS TRASERO</text>
        <text x="${bx + frontWaist*0.5}" y="${by + rise*0.4 + 15}" class="pattern-text-desc">Cortar 1x al Doblez (String)</text>
    `;
}

// 2D CAD: BOXER / CULOTTE
function drawBoxerPattern(m, seam) {
    const w = m.waistCircum || 68;
    const h = m.hipCircum || 95;
    const thigh = m.thighCircum || 54;

    const wHalf = (w / 4) * 8.5;
    const hHalf = (h / 4) * 9.5;
    const thHalf = (thigh * 0.5) * 8.5;
    const length = 180; // Largo del short

    const bx = 160;
    const by = 120;

    const boxerPath = `
        M ${bx} ${by}
        h ${wHalf}
        q ${hHalf*0.1} 50 0 100
        l ${(thHalf - wHalf)} ${length*0.4}
        v 40
        h ${-thHalf}
        c ${-20} ${-10} ${-40} ${-30} ${-(wHalf - thHalf)} ${-100}
        Z
    `;
    const boxerSeam = `
        M ${bx - seam} ${by - seam}
        h ${wHalf + seam * 2}
        q ${hHalf*0.1} 50 0 100 + seam
        l ${(thHalf - wHalf)} ${length*0.4 + seam}
        v ${40 + seam}
        h ${-thHalf - seam}
        c ${-20} ${-10} ${-40} ${-30} ${-(wHalf - thHalf) - seam} ${-100 - seam}
        Z
    `;

    return `
        <path d="${boxerSeam}" class="seam-allowance-outline" />
        <path d="${boxerPath}" class="pattern-outline" />

        <text x="${bx + wHalf*0.5}" y="${by + 90}" class="pattern-text-label">BOXER / CULOTTE</text>
        <text x="${bx + wHalf*0.5}" y="${by + 110}" class="pattern-text-desc">Cortar 4x (Látex ${state.thickness}mm)</text>
        <text x="${bx + wHalf*0.5}" y="${by - 15}" class="pattern-dimension-text">Muslo: ${(thigh).toFixed(1)} cm</text>
    `;
}

// 2D CAD: BODY / BODYSUIT
function drawBodyPattern(m, seam) {
    const bust = m.bustCircum || 90;
    const waist = m.waistCircum || 68;
    const hips = m.hipCircum || 95;
    const torso = m.ubend || 150;
    const neck = m.neckCircum || 33;

    const bh = bust * 1.8;
    const wh = waist * 1.5;
    const hh = hips * 1.8;
    const th = torso * 2.5;
    const nh = neck * 1.1;

    const fx = 180;
    const fy = 80;

    const chestCurve = state.gender === "female" ? bh * 0.15 : bh * 0.05;

    const fPath = `
        M ${fx} ${fy}
        h ${nh * 0.5}
        l ${nh * 0.4} ${nh * 0.3}
        c ${chestCurve} ${th * 0.1} ${bh * 0.25} ${th * 0.15} ${bh * 0.2} ${th * 0.25}
        q ${-(bh - wh) * 0.3} ${th * 0.2} ${-(bh - wh) * 0.4} ${th * 0.3}
        q ${(hh - wh) * 0.3} ${th * 0.2} ${(hh - wh) * 0.4} ${th * 0.3}
        c ${-hh * 0.3} ${th * 0.05} ${-hh * 0.8} ${-th * 0.02} ${-hh * 0.8} ${th * 0.1}
        h -16
        Z
    `;

    const fSeam = `
        M ${fx} ${fy - seam}
        h ${nh * 0.5 + seam}
        l ${nh * 0.4 + seam} ${nh * 0.3}
        c ${chestCurve + seam} ${th * 0.1} ${bh * 0.25 + seam} ${th * 0.15} ${bh * 0.2 + seam} ${th * 0.25}
        q ${-(bh - wh) * 0.3} ${th * 0.2} ${-(bh - wh) * 0.4} ${th * 0.3}
        q ${(hh - wh) * 0.3} ${th * 0.2} ${(hh - wh) * 0.4} ${th * 0.3}
        c ${-hh * 0.3} ${th * 0.05} ${-hh * 0.8} ${-th * 0.02} ${-hh * 0.8} ${th * 0.1 + seam}
        h ${-16 - seam}
        Z
    `;

    return `
        <path d="${fSeam}" class="seam-allowance-outline" />
        <path d="${fPath}" class="pattern-outline" />
        
        <text x="${fx + nh}" y="${fy + th * 0.4}" class="pattern-text-label">BODYSUIT DELANTERO</text>
        <text x="${fx + nh}" y="${fy + th * 0.4 + 20}" class="pattern-text-desc">Cortar 1x al Doblez (Látex ${state.thickness}mm)</text>
    `;
}

// 2D CAD: CATSUIT (Con ajuste avanzado basado en las sub-medidas)
function drawCatsuitPattern(m, seam) {
    const bust = m.bustCircum || 90;
    const waist = m.waistCircum || 68;
    const hips = m.hipCircum || 95;
    const thigh = m.thighCircum || 54;
    const calf = m.shankCircum || 34;
    const ankle = m.ankleCircum || 22;
    const leg = m.legLength || 72;
    const arm = m.armLength || 56;
    const bicep = m.upperArm || 28;

    const fx = 120;
    const fy = 50;

    // Torso Frontal del Catsuit
    const torsoPath = `
        M ${fx} ${fy}
        h 30
        l 40 30
        q 20 50 15 100
        q -30 80 -40 120
        q 40 80 50 120
        v ${leg * 3}
        h -40
        v ${-leg * 3}
        c -20 10 -40 20 -55 0
        Z
    `;

    // Manga con ajuste de bíceps y muñeca
    const mx = 350;
    const my = 50;
    const bicepScale = bicep * 3.5;
    const armPath = `
        M ${mx} ${my}
        q 45 -10 90 0
        l -20 ${arm * 4.5}
        h ${-bicepScale * 0.6}
        Z
    `;

    // Pierna cónica detallada (Muslo -> Rodilla -> Pantorrilla -> Tobillo)
    const px = 550;
    const py = 50;
    const thighScale = thigh * 2.2;
    const ankleScale = ankle * 2.0;
    const legPath = `
        M ${px} ${py}
        h ${thighScale}
        l -20 ${leg * 1.5}
        l -15 ${leg * 1.5}
        l -10 ${leg * 1.5}
        h ${-ankleScale}
        Z
    `;

    return `
        <path d="${torsoPath}" class="pattern-outline" />
        <path d="${armPath}" class="pattern-outline" />
        <path d="${legPath}" class="pattern-outline" />

        <text x="${fx + 25}" y="${fy + 180}" class="pattern-text-label">TORSO CATSUIT</text>
        <text x="${mx + 40}" y="${my + 130}" class="pattern-text-label">MANGA CATSUIT</text>
        <text x="${px + 40}" y="${py + 150}" class="pattern-text-label">PIERNA CATSUIT</text>
    `;
}

// 2D CAD: MÁSCARA
function drawMaskPattern(m, seam) {
    const head = m.headCircum || 56;
    const hh = m.headLength || 24;

    const mx = 180;
    const my = 100;
    const scaleH = head * 4.5;
    const scaleV = hh * 10;

    const profilePath = `
        M ${mx} ${my}
        c ${scaleH * 0.15} ${-scaleV * 0.05} ${scaleH * 0.35} ${scaleV * 0.02} ${scaleH * 0.45} ${scaleV * 0.15}
        c ${scaleH * 0.08} ${scaleV * 0.15} ${scaleH * 0.05} ${scaleV * 0.4} 0 ${scaleV * 0.55}
        c ${-scaleH * 0.1} ${scaleV * 0.25} ${-scaleH * 0.3} ${scaleV * 0.25} ${-scaleH * 0.45} ${scaleV * 0.2}
        C ${mx - 40} ${my + scaleV * 0.6} ${mx} ${my + scaleV * 0.3} ${mx} ${my}
        Z
        <!-- Ojos -->
        M ${mx + scaleH * 0.2} ${my + scaleV * 0.3}
        q 15 -10 30 0
        q -15 15 -30 0 Z
    `;

    return `
        <path d="${profilePath}" class="pattern-outline" />
        <text x="${mx + 60}" y="${my + 120}" class="pattern-text-label">MÁSCARA LATERAL</text>
    `;
}

// 2D CAD: GUANTES
function drawGlovesPattern(m, seam) {
    const wrist = m.wristCircum || 16;
    const hand = m.handLength || 18;

    const gx = 250;
    const gy = 100;
    const wHalf = wrist * 8.0;
    const fLen = hand * 12;

    const glovePath = `
        M ${gx} ${gy + fLen + 40}
        h ${wHalf}
        v ${-fLen * 0.7}
        c 0 -30 20 -30 20 -60
        v ${-fLen}
        h -25
        v ${fLen * 0.8}
        h -10
        v ${-fLen * 1.1}
        h -25
        v ${fLen * 1.1}
        h -10
        v ${-fLen * 1.0}
        h -25
        v ${fLen * 1.0}
        h -10
        v ${-fLen * 0.8}
        h -25
        Z
    `;

    return `
        <path d="${glovePath}" class="pattern-outline" />
        <text x="${gx + wHalf/2}" y="${gy + fLen + 90}" class="pattern-text-label">GUANTE</text>
    `;
}

// 2D CAD: MEDIAS
function drawStockingsPattern(m, seam) {
    const ankle = m.ankleCircum || 22;
    const calf = m.shankCircum || 34;
    const thigh = m.thighCircum || 54;
    const len = m.legLength || 72;

    const sx = 280;
    const sy = 80;
    const aHalf = ankle * 3.5;
    const cHalf = calf * 3.5;
    const tHalf = thigh * 3.5;
    const hVisual = len * 6;

    const stockingPath = `
        M ${sx} ${sy}
        h ${tHalf}
        l ${-(tHalf - cHalf) * 0.5} ${hVisual * 0.4}
        l ${-(cHalf - aHalf) * 0.5} ${hVisual * 0.6}
        v 40
        h ${-aHalf}
        v -40
        l ${-(cHalf - aHalf) * 0.5} ${-hVisual * 0.6}
        Z
    `;

    return `
        <path d="${stockingPath}" class="pattern-outline" />
        <text x="${sx + tHalf/2}" y="${sy + hVisual/2}" class="pattern-text-label">MEDIA</text>
    `;
}

// 11. MOTOR DEL SIMULADOR 3D INTERACTIVO (PROYECCIÓN TRIGONOMÉTRICA 360°)
// Este motor define un maniquí de costura con vértices en el espacio (X, Y, Z).
// Al rotar con el ratón o el deslizador (ángulo theta), rotamos las coordenadas trigonométricamente
// y las proyectamos al plano del canvas SVG.
function draw3DMannequin() {
    const angleRad = (state.rotationAngle * Math.PI) / 180;
    const cosA = Math.cos(angleRad);
    const sinA = Math.sin(angleRad);

    const isFemale = state.gender === "female";

    // Medidas simplificadas
    const h = state.measurements["height"] || 165;
    const bust = state.measurements["bustCircum"] || 90;
    const waist = state.measurements["waistCircum"] || 68;
    const hips = state.measurements["hipCircum"] || 95;
    const thigh = state.measurements["thighCircum"] || 54;
    const shoulder = state.measurements["shoulderLen"] || 38;
    const neck = state.measurements["neckCircum"] || 33;
    const arm = state.measurements["armLength"] || 56;
    const leg = state.measurements["legLength"] || 72;

    // Definición de Vértices Anatómicos 3D: { nombre: [X, Y, Z] }
    // Centramos el maniquí de modo que Y=0 es la entrepierna/cadera baja
    const rawVertices = {
        headTop: [0, h * 0.42, 0],
        headCenter: [0, h * 0.35, 0],
        neck: [0, h * 0.28, 0],
        shoulderL: [-shoulder * 0.45, h * 0.26, 0],
        shoulderR: [shoulder * 0.45, h * 0.26, 0],
        chestL: [-bust * 0.16, h * 0.16, isFemale ? 6 : 2],
        chestR: [bust * 0.16, h * 0.16, isFemale ? 6 : 2],
        waistL: [-waist * 0.15, h * 0.05, 0],
        waistR: [waist * 0.15, h * 0.05, 0],
        hipsL: [-hips * 0.17, -h * 0.03, 0],
        hipsR: [hips * 0.17, -h * 0.03, 0],
        crotch: [0, -h * 0.08, 0],
        
        // Extremidades Izquierdas (L)
        elbowL: [-shoulder * 0.55 - arm * 0.35, h * 0.10, -3],
        wristL: [-shoulder * 0.55 - arm * 0.70, -h * 0.05, -1],
        kneeL: [-hips * 0.12, -h * 0.25, 0],
        ankleL: [-hips * 0.12, -h * 0.43, 0],

        // Extremidades Derechas (R)
        elbowR: [shoulder * 0.55 + arm * 0.35, h * 0.10, -3],
        wristR: [shoulder * 0.55 + arm * 0.70, -h * 0.05, -1],
        kneeR: [hips * 0.12, -h * 0.25, 0],
        ankleR: [hips * 0.12, -h * 0.43, 0]
    };

    // Ajustes estéticos por anatomía de caderas/pecho
    if (isFemale) {
        // Silueta Femenina: cintura más estrecha
        rawVertices.waistL[0] *= 0.88;
        rawVertices.waistR[0] *= 0.88;
    } else {
        // Silueta Masculina: hombros más anchos, pecho plano
        rawVertices.shoulderL[0] *= 1.15;
        rawVertices.shoulderR[0] *= 1.15;
        rawVertices.hipsL[0] *= 0.92;
        rawVertices.hipsR[0] *= 0.92;
    }

    // Rotar y Proyectar a 2D
    const projected = {};
    const centerX = 200;
    const centerY = 200;
    const scale = 1.35; // Escala visual 3D

    for (let key in rawVertices) {
        const [x, y, z] = rawVertices[key];
        
        // Rotación alrededor del eje Y (horizontal rotativo)
        const rotX = x * cosA - z * sinA;
        const rotZ = x * sinA + z * cosA;
        
        // Proyección paralela simple
        projected[key] = {
            x: centerX + rotX * scale,
            y: centerY - y * scale, // Inversión de eje Y
            z: rotZ // Para cálculo de visibilidad e iluminación
        };
    }

    // Dibujar maniquí base en 3D
    const p = projected;

    // Iluminación dinámica de látex (Efecto brillo que cambia según la rotación)
    // El brillo se define mediante gradientes lineales SVG que adaptan sus puntos de luz
    const lightSourceX = 50 + sinA * 30; // Mueve la luz al girar el modelo

    const modelSilhouetteSvg = `
        <defs>
            <linearGradient id="latex-3d-shine" x1="${lightSourceX}%" y1="0%" x2="${100 - lightSourceX}%" y2="100%">
                <stop offset="0%" stop-color="#2a0013" />
                <stop offset="35%" stop-color="#ff2a85" />
                <stop offset="42%" stop-color="#ffffff" /> <!-- Glare reflection line -->
                <stop offset="48%" stop-color="#ff2a85" />
                <stop offset="85%" stop-color="#18000a" />
                <stop offset="100%" stop-color="#050002" />
            </linearGradient>
            <!-- Sombra de pie -->
            <ellipse id="shadow-floor" cx="200" cy="380" rx="60" ry="10" fill="rgba(0,0,0,0.5)" />
        </defs>

        <!-- Sombra del maniquí -->
        <use href="#shadow-floor" />

        <!-- Silueta del Cuerpo (Boceto de alambre técnico) -->
        <!-- Brazos -->
        <line x1="${p.shoulderL.x}" y1="${p.shoulderL.y}" x2="${p.elbowL.x}" y2="${p.elbowL.y}" class="model-3d-bone" />
        <line x1="${p.elbowL.x}" y1="${p.elbowL.y}" x2="${p.wristL.x}" y2="${p.wristL.y}" class="model-3d-bone" />
        <line x1="${p.shoulderR.x}" y1="${p.shoulderR.y}" x2="${p.elbowR.x}" y2="${p.elbowR.y}" class="model-3d-bone" />
        <line x1="${p.elbowR.x}" y1="${p.elbowR.y}" x2="${p.wristR.x}" y2="${p.wristR.y}" class="model-3d-bone" />

        <!-- Piernas -->
        <line x1="${p.hipsL.x}" y1="${p.hipsL.y}" x2="${p.kneeL.x}" y2="${p.kneeL.y}" class="model-3d-bone" />
        <line x1="${p.kneeL.x}" y1="${p.kneeL.y}" x2="${p.ankleL.x}" y2="${p.ankleL.y}" class="model-3d-bone" />
        <line x1="${p.hipsR.x}" y1="${p.hipsR.y}" x2="${p.kneeR.x}" y2="${p.kneeR.y}" class="model-3d-bone" />
        <line x1="${p.kneeR.x}" y1="${p.kneeR.y}" x2="${p.ankleR.x}" y2="${p.ankleR.y}" class="model-3d-bone" />

        <!-- Silueta anatómica general -->
        <path d="M ${p.neck.x} ${p.neck.y}
                 L ${p.shoulderL.x} ${p.shoulderL.y}
                 L ${p.chestL.x} ${p.chestL.y}
                 L ${p.waistL.x} ${p.waistL.y}
                 L ${p.hipsL.x} ${p.hipsL.y}
                 L ${p.crotch.x} ${p.crotch.y}
                 L ${p.hipsR.x} ${p.hipsR.y}
                 L ${p.waistR.x} ${p.waistR.y}
                 L ${p.chestR.x} ${p.chestR.y}
                 L ${p.shoulderR.x} ${p.shoulderR.y}
                 Z" 
              class="model-3d-silhouette" />

        <!-- Cabeza -->
        <circle cx="${p.headCenter.x}" cy="${p.headCenter.y}" r="${p.headTop.y - p.headCenter.y}" class="model-3d-silhouette" />
    `;

    // Renderizar la PRENDA seleccionada en 3D sobrepuesta al cuerpo
    let garment3dSvg = "";
    const fillStyle = "fill='url(#latex-3d-shine)' stroke='#ff2a85' stroke-width='1.5'";

    switch (state.garment) {
        case "body":
            garment3dSvg = `
                <!-- Body en 3D -->
                <path d="M ${p.shoulderL.x} ${p.shoulderL.y}
                         L ${p.chestL.x} ${p.chestL.y}
                         L ${p.waistL.x} ${p.waistL.y}
                         L ${p.hipsL.x} ${p.hipsL.y}
                         Q ${p.crotch.x - 20} ${p.crotch.y - 10} ${p.crotch.x} ${p.crotch.y}
                         Q ${p.crotch.x + 20} ${p.crotch.y - 10} ${p.hipsR.x} ${p.hipsR.y}
                         L ${p.waistR.x} ${p.waistR.y}
                         L ${p.chestR.x} ${p.chestR.y}
                         L ${p.shoulderR.x} ${p.shoulderR.y}
                         Q ${p.neck.x} ${p.neck.y + 10} ${p.shoulderL.x} ${p.shoulderL.y}
                         Z" 
                      ${fillStyle} class="latex-garment-3d" />
            `;
            break;

        case "catsuit":
            garment3dSvg = `
                <!-- Catsuit en 3D (Cuerpo entero, brazos y piernas) -->
                <path d="M ${p.neck.x} ${p.neck.y}
                         L ${p.shoulderL.x} ${p.shoulderL.y}
                         L ${p.elbowL.x} ${p.elbowL.y}
                         L ${p.wristL.x} ${p.wristL.y}
                         L ${p.elbowL.x - 5} ${p.elbowL.y + 5}
                         L ${p.chestL.x} ${p.chestL.y}
                         L ${p.waistL.x} ${p.waistL.y}
                         L ${p.hipsL.x} ${p.hipsL.y}
                         L ${p.kneeL.x} ${p.kneeL.y}
                         L ${p.ankleL.x} ${p.ankleL.y}
                         L ${p.crotch.x} ${p.crotch.y}
                         L ${p.ankleR.x} ${p.ankleR.y}
                         L ${p.kneeR.x} ${p.kneeR.y}
                         L ${p.hipsR.x} ${p.hipsR.y}
                         L ${p.waistR.x} ${p.waistR.y}
                         L ${p.chestR.x} ${p.chestR.y}
                         L ${p.elbowR.x + 5} ${p.elbowR.y + 5}
                         L ${p.wristR.x} ${p.wristR.y}
                         L ${p.elbowR.x} ${p.elbowR.y}
                         L ${p.shoulderR.x} ${p.shoulderR.y}
                         Z" 
                      ${fillStyle} class="latex-garment-3d" />
            `;
            break;

        case "colaless":
            // Colaless: Triángulo frontal en 3D y tira posterior interactiva
            garment3dSvg = `
                <!-- Cinturilla Colaless -->
                <path d="M ${p.hipsL.x} ${p.hipsL.y - 10} 
                         Q ${p.crotch.x} ${p.crotch.y - 30} ${p.hipsR.x} ${p.hipsR.y - 10}" 
                      fill="none" stroke="#ff2a85" stroke-width="2.5" />
                
                <!-- Triángulo Colaless frontal (o posterior según rotación) -->
                <path d="M ${p.waistL.x + 8} ${p.waistL.y}
                         L ${p.waistR.x - 8} ${p.waistR.y}
                         Q ${p.crotch.x} ${p.crotch.y + 5} ${p.crotch.x} ${p.crotch.y}
                         Z" 
                      ${fillStyle} class="latex-garment-3d" />
            `;
            break;

        case "sosten":
            // Sostén en 3D: copas envolventes y banda elástica
            garment3dSvg = `
                <!-- Banda de bajo pecho -->
                <path d="M ${p.waistL.x} ${p.waistL.y + 20} 
                         Q ${p.crotch.x} ${p.waistL.y + 25} ${p.waistR.x} ${p.waistR.y + 20}" 
                      fill="none" stroke="#ff2a85" stroke-width="3" />
                
                <!-- Copa Izquierda -->
                <circle cx="${p.chestL.x}" cy="${p.chestL.y}" r="${bust * 0.08}" ${fillStyle} class="latex-garment-3d" />
                
                <!-- Copa Derecha -->
                <circle cx="${p.chestR.x}" cy="${p.chestR.y}" r="${bust * 0.08}" ${fillStyle} class="latex-garment-3d" />

                <!-- Tirantes -->
                <path d="M ${p.shoulderL.x} ${p.shoulderL.y} Q ${p.chestL.x} ${p.chestL.y - 15} ${p.chestL.x} ${p.chestL.y - 10}" fill="none" stroke="#ff2a85" stroke-width="1.5" />
                <path d="M ${p.shoulderR.x} ${p.shoulderR.y} Q ${p.chestR.x} ${p.chestR.y - 15} ${p.chestR.x} ${p.chestR.y - 10}" fill="none" stroke="#ff2a85" stroke-width="1.5" />
            `;
            break;

        case "boxer":
            // Bóxer/Culotte en 3D
            garment3dSvg = `
                <path d="M ${p.waistL.x} ${p.waistL.y}
                         L ${p.hipsL.x} ${p.hipsL.y}
                         L ${p.kneeL.x + 2} ${p.kneeL.y + 20}
                         H ${p.crotch.x - 5}
                         L ${p.crotch.x} ${p.crotch.y}
                         L ${p.crotch.x + 5} ${p.crotch.y}
                         H ${p.kneeR.x - 2} ${p.kneeR.y + 20}
                         L ${p.hipsR.x} ${p.hipsR.y}
                         L ${p.waistR.x} ${p.waistR.y}
                         Z" 
                      ${fillStyle} class="latex-garment-3d" />
            `;
            break;

        case "mask":
            garment3dSvg = `
                <!-- Máscara de cabeza completa en 3D -->
                <circle cx="${p.headCenter.x}" cy="${p.headCenter.y}" r="${p.headTop.y - p.headCenter.y + 0.5}" ${fillStyle} class="latex-garment-3d" />
                <!-- Cuello de la máscara -->
                <path d="M ${p.neck.x - 10} ${p.neck.y} H ${p.neck.x + 10} L ${p.shoulderR.x - 15} ${p.shoulderR.y} L ${p.shoulderL.x + 15} ${p.shoulderL.y} Z" ${fillStyle} />
            `;
            break;

        case "gloves":
            garment3dSvg = `
                <!-- Guantes 3D en antebrazos -->
                <path d="M ${p.elbowL.x + (p.wristL.x - p.elbowL.x)*0.3} ${p.elbowL.y + (p.wristL.y - p.elbowL.y)*0.3} L ${p.wristL.x} ${p.wristL.y} Z" stroke="#ff2a85" stroke-width="6" stroke-linecap="round" />
                <path d="M ${p.elbowR.x + (p.wristR.x - p.elbowR.x)*0.3} ${p.elbowR.y + (p.wristR.y - p.elbowR.y)*0.3} L ${p.wristR.x} ${p.wristR.y} Z" stroke="#ff2a85" stroke-width="6" stroke-linecap="round" />
            `;
            break;

        case "stockings":
            garment3dSvg = `
                <!-- Medias en las piernas en 3D -->
                <path d="M ${p.kneeL.x} ${p.kneeL.y - 10} L ${p.ankleL.x} ${p.ankleL.y}" stroke="#ff2a85" stroke-width="9" stroke-linecap="round" />
                <path d="M ${p.kneeR.x} ${p.kneeR.y - 10} L ${p.ankleR.x} ${p.ankleR.y}" stroke="#ff2a85" stroke-width="9" stroke-linecap="round" />
            `;
            break;
    }

    const final3dSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 400 440">
            ${modelSilhouetteSvg}
            ${garment3dSvg}
        </svg>
    `;

    sim3dCanvasContainer.innerHTML = final3dSvg;
}

// 12. FICHA DE CORTE DINÁMICA
function updateCutList() {
    const cutContainer = document.getElementById("cut-list-dynamic");
    let content = "";

    const specText = `Látex ${state.thickness.toFixed(2)}mm — Solapamiento: ${state.seamAllowance}mm`;

    if (state.garment === "panties") {
        content = `
            <div class="cut-item"><span class="cut-qty">1x</span><span class="cut-name">Panel Delantero</span><span class="cut-spec">${specText}</span></div>
            <div class="cut-item"><span class="cut-qty">1x</span><span class="cut-name">Panel Trasero</span><span class="cut-spec">${specText}</span></div>
        `;
    } else if (state.garment === "body") {
        content = `
            <div class="cut-item"><span class="cut-qty">1x</span><span class="cut-name">Panel Frontal Torso</span><span class="cut-spec">${specText} (Doblez)</span></div>
            <div class="cut-item"><span class="cut-qty">2x</span><span class="cut-name">Paneles Espalda Torso</span><span class="cut-spec">${specText} (Espejo)</span></div>
        `;
    } else if (state.garment === "catsuit") {
        content = `
            <div class="cut-item"><span class="cut-qty">2x</span><span class="cut-name">Torso Frontal Catsuit</span><span class="cut-spec">${specText}</span></div>
            <div class="cut-item"><span class="cut-qty">2x</span><span class="cut-name">Torso Trasero Catsuit</span><span class="cut-spec">${specText}</span></div>
            <div class="cut-item"><span class="cut-qty">2x</span><span class="cut-name">Manga Larga</span><span class="cut-spec">${specText}</span></div>
            <div class="cut-item"><span class="cut-qty">2x</span><span class="cut-name">Piernas Catsuit (L/R)</span><span class="cut-spec">${specText}</span></div>
        `;
    } else if (state.garment === "sosten") {
        content = `
            <div class="cut-item"><span class="cut-qty">2x</span><span class="cut-name">Copa Superior (Crescent)</span><span class="cut-spec">Látex 0.25 - 0.40mm</span></div>
            <div class="cut-item"><span class="cut-qty">2x</span><span class="cut-name">Copa Base (Con Pinza)</span><span class="cut-spec">Látex 0.25 - 0.40mm</span></div>
            <div class="cut-item"><span class="cut-qty">2x</span><span class="cut-name">Tira Banda Contorno</span><span class="cut-spec">Látex Reforzado 0.50mm+</span></div>
        `;
    } else if (state.garment === "colaless") {
        content = `
            <div class="cut-item"><span class="cut-qty">1x</span><span class="cut-name">Triángulo Delantero</span><span class="cut-spec">${specText}</span></div>
            <div class="cut-item"><span class="cut-qty">1x</span><span class="cut-name">Tira de Cola Posterior</span><span class="cut-spec">Látex 0.40mm (Corte Recto)</span></div>
            <div class="cut-item"><span class="cut-qty">2x</span><span class="cut-name">Bandas de Cintura Lateral</span><span class="cut-spec">Látex 0.40mm</span></div>
        `;
    } else if (state.garment === "boxer") {
        content = `
            <div class="cut-item"><span class="cut-qty">4x</span><span class="cut-name">Paneles Boxer (Dobles)</span><span class="cut-spec">${specText}</span></div>
            <div class="cut-item"><span class="cut-qty">1x</span><span class="cut-name">Refuerzo Entrepierna</span><span class="cut-spec">Látex 0.40mm</span></div>
        `;
    } else if (state.garment === "mask") {
        content = `
            <div class="cut-item"><span class="cut-qty">2x</span><span class="cut-name">Lateral Cabeza (Perfil)</span><span class="cut-spec">Látex 0.40mm (Espejo)</span></div>
        `;
    } else {
        content = `
            <div class="cut-item"><span class="cut-qty">2x</span><span class="cut-name">Paneles Patronados</span><span class="cut-spec">${specText}</span></div>
        `;
    }

    cutContainer.innerHTML = content;
}

// 13. EXPORTACIÓN REAL 1:1 EN MILÍMETROS
function exportSVGPattern() {
    const rawSvg = canvasContainer.querySelector("svg");
    if (!rawSvg) return;

    const exportWidthMM = 950;
    const exportHeightMM = 950;

    const patternGroupClone = rawSvg.querySelector("g#transform-group").cloneNode(true);
    patternGroupClone.removeAttribute("transform");

    const exportSvgString = `<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${exportWidthMM}mm" height="${exportHeightMM}mm" viewBox="0 0 ${exportWidthMM} ${exportHeightMM}">
    <style>
        .pattern-outline { fill: none; stroke: #ff2a85; stroke-width: 1.5; }
        .seam-allowance-outline { fill: none; stroke: #00f0ff; stroke-width: 0.8; stroke-dasharray: 4, 4; }
        .pattern-dimension-line { stroke: #64748b; stroke-width: 0.5; }
        .pattern-dimension-text { fill: #64748b; font-size: 8px; font-family: Arial, sans-serif; text-anchor: middle; }
        .pattern-text-label { fill: #0f0f16; font-size: 11px; font-family: Arial, sans-serif; font-weight: bold; text-anchor: middle; }
        .pattern-text-desc { fill: #64748b; font-size: 8px; font-family: Arial, sans-serif; text-anchor: middle; }
    </style>
    <rect width="${exportWidthMM}" height="${exportHeightMM}" fill="none" stroke="#cccccc" stroke-width="1" stroke-dasharray="10, 5" />
    <g transform="translate(50, 50)">
        ${patternGroupClone.innerHTML}
    </g>
</svg>`;

    const blob = new Blob([exportSvgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    
    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = `latex-tailor-${state.garment}-${state.gender}-${state.sizePreset}.svg`;
    
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
}

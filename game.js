// Configurando a cena
const scene = new THREE.Scene();

//Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Renderizador
const renderer = new THREE.WebGLRenderer();

//Tmanho da tela
renderer.setSize(window.innerWidth, window.innerHeight);

// Linka o renderizador no arquivo index.html
document.body.appendChild(renderer.domElement);

// instanciando o loader
const loader = new THREE.GLTFLoader();

//carregando árvore
loader.load("../tree/scene.gltf", function(gltf){
    scene.add(gltf.scene);
    gltf.scene.scale.set(16, 16, 16);
    gltf.scene.position.set(0, -6, -12);
});

//classe player (construir jogador)
class Player{
    constructor(){
        const geometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
        const material = new THREE.MeshBasicMaterial({color: 0xffffff});
        const player = new THREE.Mesh(geometry, material);
        scene.add(player);
        this.player = player;

        player.position.x = 3;
        player.position.y = 0;
        player.position.z = 0;

        this.playerInfo = {
            positionX: 6,
            velocity: 0,
        };
    };

    anda(){
        this.playerInfo.velocity = 0.1;
    };

    update(){
        this.checa();
        this.playerInfo.positionX -= this.playerInfo.velocity;
        this.player.position.x = this.playerInfo.positionX;
    }

    para(){
        this.playerInfo.velocity = 0;
    }

    checa(){
        if(this.playerInfo.velocity > 0 && !tadecostas){
            text.innerText = "Você perdeu!"
            gamestatus = "fimdejogo";
        }

        if(this.playerInfo.positionX < -6){
            text.innerText = "Você venceu!";
            gamestatus = "fimdejogo";
        }
    }
}

function delay(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

// classe boneca
class boneca{
    constructor(){
        //carregando o modelo 3D na pasta model
        loader.load("../model/scene.gltf", (gltf) => {
        scene.add(gltf.scene);
        gltf.scene.scale.set(0.4, 0.4, 0.4);
        gltf.scene.position.set(0, -1, -1);
        this.Boneca1 = gltf.scene;
        });
    };

    paraTras(){
        gsap.to(this.Boneca1.rotation, {y:-3.15, duration:1});
        setTimeout(() => tadecostas = true, 150);
    };

    paraFrente(){
        gsap.to(this.Boneca1.rotation, {y:0, duration:1});
        setTimeout(() => tadecostas = false, 350);
    };

    async start(){
        this.paraTras();
        await delay((Math.random()*1000)+1000);
        this.paraFrente();
        await delay((Math.random()*1000)+1000);
        this.start();
    };
};

let Player1 = new Player();
let Boneca1 = new boneca();
const text = document.querySelector(".text");
const tmaximo = 10;
let gamestatus = "esperando";
let tadecostas = true;

async function init(){
    await delay(500);
    text.innerText = "Começando em 3";
    await delay(500);
    text.innerText = "Começando em 2";
    await delay(500);
    text.innerText = "Começando em 1";
    await delay(500);
    text.innerText = "VAI!!";
    startGame();
};

function startGame(){
    gamestatus = "jogando";
    Boneca1.start();
    setTimeout(() => {
        if(gamestatus != "fimdejogo"){
            text.innerText = "Timeout!";
            gamestatus = "fimdejogo";
        }
    }, tmaximo * 1000);
};
init();

setTimeout(() => {
    Boneca1.paraTras}, 1000);

//adcionando luz
const light = new THREE.AmbientLight(0xffffff);
scene.add(light);

//alterando a cor de fundo
renderer.setClearColor(0x8601af, 1);

//configurar a profundidade da camera
camera.position.z = 5;

//renderizar a cena
function animate(){
    if(gamestatus == "fimdejogo"){
        return;
    }
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    Player1.update();
}
animate();

// capturando alteração de resolução e chama a funcao
window.addEventListener('riseze', onWindowResize, false);

//funcçaõ que torna a tela resposiva
function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

//qunado pressiona a tecla
window.addEventListener('keydown', function(e){
    if(gamestatus != "jogando"){
        return;
    }
    if(e.key === "ArrowLeft"){
        Player1.anda();
    }
});

window.addEventListener('keyup', function(e){
    if(e.key === "ArrowLeft")
        Player1.para();
});
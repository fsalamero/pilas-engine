/// <reference path="modo.ts"/>

class ModoPausa extends Modo {
  pilas: Pilas;

  graphics_modo_pausa: any;
  fps: any;

  posicion: number;
  sprites: any;
  texto: any;
  total: number;

  izquierda: any;
  derecha: any;

  constructor() {
    super({ key: "ModoPausa" });
  }

  preload() {}

  create(datos) {
    super.create(datos, 100, 100);
    this.pilas = datos.pilas;
    this.posicion = this.pilas.historia.obtener_cantidad_de_posiciones();
    this.total = this.pilas.historia.obtener_cantidad_de_posiciones();
    this.sprites = [];
    this.crear_sprites_desde_historia(this.posicion);

    this.crear_canvas_de_depuracion_modo_pausa();
    this.matter.systems.matterPhysics.world.createDebugGraphic();

    let t = this.pilas.historia.obtener_cantidad_de_posiciones();
    let datos_para_el_editor = { minimo: 0, posicion: t, maximo: t };
    this.pilas.mensajes.emitir_mensaje_al_editor("comienza_a_depurar_en_modo_pausa", datos_para_el_editor);
  }

  private crear_sprites_desde_historia(posicion) {
    let foto = this.pilas.historia.obtener_foto(posicion);

    this.sprites.map(sprite => {
      if (sprite.figura) {
        this.pilas.Phaser.Physics.Matter.Matter.World.remove(this.pilas.modo.matter.world.localWorld, sprite.figura);
      }

      sprite.destroy();
    });

    this.posicionar_la_camara(foto.escena);
    //this.crear_fondo(foto.escena.fondo);

    this.sprites = foto.actores.map(entidad => {
      return this.crear_sprite_desde_entidad(entidad);
    });

    //this.sprites.push(this.fondo);
  }

  update() {
    this.graphics.clear();

    if (this.fps) {
      this.fps.alpha = 0;
    }

    if (this.pilas.depurador.mostrar_fisica) {
      this.matter.systems.matterPhysics.world.debugGraphic.setAlpha(1);
    } else {
      this.matter.systems.matterPhysics.world.debugGraphic.setAlpha(0);
    }

    if (this.pilas.depurador.modo_posicion_activado) {
      let foto = this.pilas.historia.obtener_foto(this.posicion);
      foto.actores.map(sprite => {
        let { x, y } = this.pilas.utilidades.convertir_coordenada_de_pilas_a_phaser(sprite.x, sprite.y);

        this.dibujar_punto_de_control(this.graphics, x, y);
      });
    }
  }

  crear_sprite_desde_entidad(entidad) {
    let { x, y } = this.pilas.utilidades.convertir_coordenada_de_pilas_a_phaser(entidad.x, entidad.y);
    let sprite = this.add.sprite(x, y, entidad.imagen);

    sprite.angle = -entidad.rotacion;
    sprite.setOrigin(entidad.centro_x, entidad.centro_y);
    sprite.scaleX = entidad.escala_x;
    sprite.scaleY = entidad.escala_y;
    sprite.alpha = 1 - entidad.transparencia / 100;
    sprite.setFlipX(entidad.espejado);
    sprite.setFlipY(entidad.espejado_vertical);
    sprite.depth = -entidad.z;

    if (entidad.figura) {
      sprite["figura"] = this.crear_figura_estatica_para(entidad);
    }

    return sprite;
  }

  actualizar_posicion(posicion) {
    this.posicion = posicion;
    this.posicion = Math.min(this.posicion, this.total);
    this.posicion = Math.max(this.posicion, 0);

    this.crear_sprites_desde_historia(this.posicion);
    //this.actualizar_texto();
    //this.game.world.bringToTop(this.canvas);
  }

  /*
    this.izquierda = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    this.derecha = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    this.crear_texto();
    */

  crear_canvas_de_depuracion_modo_pausa() {
    let graphics_modo_pausa = this.add.graphics({ x: 0, y: 0 });
    graphics_modo_pausa.depth = 190;
    this.graphics_modo_pausa = graphics_modo_pausa;

    this.pilas.historia.dibujar_puntos_de_las_posiciones_recorridas(graphics_modo_pausa);
  }
}

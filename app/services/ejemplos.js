import $ from "jquery";
import Service from "@ember/service";
import config from "pilas-engine/config/environment";
import { task, timeout } from "ember-concurrency";

export default Service.extend({
  cache: null,

  tarea: task(function*() {
    if (this.cache) {
      return this.cache;
    }

    yield timeout(500);

    let data = yield $.ajax({
      mimeType: "application/json",
      dataType: "json",
      url: `${config.rootURL}ejemplos/ejemplos.json`
    });

    for (let i = 0; i < data.ejemplos.length; i++) {
      let ejemplo = data.ejemplos[i];

      let proyecto = yield $.ajax({
        url: `${config.rootURL}ejemplos/proyectos/${ejemplo.nombre}.json`
      });

      ejemplo.proyecto = proyecto;
    }

    this.set("cache", data);
    return data;
  }).drop(),

  obtener() {
    return this.tarea.perform();
  }
});

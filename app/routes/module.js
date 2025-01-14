import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default class ModuleRoute extends Route {
  @service
  legacyModuleMappings;

  model(params) {
    return this.legacyModuleMappings
      .fetch()
      .then((response) => response.json())
      .then((mappings) => {
        return {
          moduleName: params.module.substr(0, params.module.lastIndexOf('.')),
          mappings: this.legacyModuleMappings.buildMappings(mappings),
        };
      });
  }

  redirect(model) {
    let mappingInfo = this.legacyModuleMappings.getNewModuleFromOld(
      model.moduleName,
      model.mappings
    );
    if (!mappingInfo.error && model.moduleName !== mappingInfo.module) {
      return this.transitionTo(
        `project-version.modules.module`,
        'ember',
        'release',
        mappingInfo.module
      );
    }
    return this.transitionTo('project-version', 'ember', 'release');
  }
}

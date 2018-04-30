const path = require('path');
const YAML = require('yamljs');
const fs = require('fs');

const resourceData = require(path.join('util', 'ymlLoader')).messageAttachments;
const groupByArray = require(path.join('util', 'groupBy')).groupByArray;

const getIndex = (req, res) => {
  res.render('templates/index', { title: 'Greetbot Templates' });
};

const getAllResources = (req, res) => {
  const resourcesByLang = groupByArray(resourceData, 'language');
  const groupedResources = resourcesByLang.map( (lang) => {
    lang.values = groupByArray(lang.values, 'level');
    return lang;
  });
  res.render('templates/resources/index', { title: 'Greetbot Resources', groupedResources: groupedResources });
};

const getResource = (req, res) => {
  const resource = resourceData.filter(resource => {
    return resource.name === req.params.name;
  })[0];
  res.render('templates/resources/show', { title: resource.name, resource: resource });
};

const updateResource = (req, res) => {
  const resource = req.body.resource;
  const ymltext = YAML.stringify(resource, 2);
  fs.writeFile(path.resolve(__dirname, '..', 'app', 'routes', 'data', 'slash', 'resources', 'messageAttachments', resource.language, resource.level, `${resource.name}.yml`), ymltext, (err) => {
    if (err) {
      console.log(err);
    }
  });
  res.redirect('/templates/resources');
};

module.exports = { getIndex, getAllResources, getResource, updateResource };
import routes from './routes.js'

const constructorMethod = (app) => {
    app.use('/', routes);
  
    app.use('*', (req, res) => {
      return res.status(404).json({error: 'Not found'});
    });
  };
  
export default constructorMethod;
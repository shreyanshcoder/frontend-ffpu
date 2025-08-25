# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)




[id,session_id,user_id,insert_time,strat_name,strat_name_alias,isPublic,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022]

['1997', '1998', '1999', '2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', 'insert_time', 'reference_file', 'strat_name', 'strat_uuid', 'tag', 'user_id']



[id,session_id,insert_time,strat_name,nyears,cagr_mean,cagr_median,cagr_std,sharpe_ratio,ndatapoint,index_mean,index_median,index_std,index_SR,alpha_mean,alpha_median,alpha_std,alpha_SR,cagr_dwn_std,index_dwn_std,alpha_dwn_std,avg_no_stock,prob_0_15,prob_0,prob_0_7,prob_0_15p,prob_0_25,prob_0_5,prob_1,alpha_0_15,alpha_0,alpha_0_7,alpha_0_15_pos,alpha_0_25,alpha_0_5,alpha_1,highest_pcagr,lowest_pcagr,highest_index,lowest_index,highest_alpha,lowest_alpha,mod_list_pct]

['alpha_0', 'alpha_0.07', 'alpha_0.15', 'alpha_0.15_pos', 'alpha_0.25', 'alpha_0.5', 'alpha_1', 'alpha_dwn_std_dev', 'alpha_mean', 'alpha_median', 'alpha_sharpe', 'alpha_std', 'avg_n_stck', 'dwn_std_dev', 'highest_alpha', 'highest_index', 'highest_pcagr', 'id', 'index_mean', 'index_median', 'index_sharpe', 'index_std', 'indx_dwn_std_dev', 'insert_time', 'lowest_alpha', 'lowest_index', 'lowest_pcagr', 'mean', 'median', 'Mod_List%', 'ndatapoints', 'nyears', 'prob_0', 'prob_0.07', 'prob_0.15', 'prob_0.15_pos', 'prob_0.25', 'prob_0.5', 'prob_1', 'reference_file', 'sharpe', 'std', 'strat_name', 'strat_uuid', 'tag']


1. portfolio_investment_rules 
    1. session_id -> strat_uuid (in loc)
    2. strat_name_alias -> to be added (in server)
    3. isPublic -> is_public (in loc) -> to be added (in server)
    4. tag + reference_file -> to be added (in loc)
    5. id -> to be added (in server)
    6. 2023 + 2024 -> to be added (in loc)

2. investmen_rules_statistics
    1. session_id -> strat_uuid (in loc)
    2. SR -> sharpe 
    3. tag + reference_file -> to be added (in loc)
    4. id -> to be added (in server)
    5. cagr -> can be omitted

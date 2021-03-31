import { createGlobalStyle } from 'styled-components';
import 'normalize.css';

export default createGlobalStyle`
   html,
   body{
       margin: 0;
       padding: 0;
       height: 100%;
       width: 100%;
   }

   #root{
       height: 100%;
       width: 100%;
   }
`;

/**
 * Unauthorized Access Page Component Module
 * Displays a 403 error message when user attempts to access restricted content
 * Provides clear feedback about access denial
 */

/**
 * Unauthorized Component
 * Renders a simple error message for unauthorized access attempts
 * 
 * @returns {React.ReactElement} 403 error message component
 */
const Unauthorized = () => {
  return (
    <h2>403 - Access Denied. You do not have permission to view this page.</h2>
  );
};

export default Unauthorized;

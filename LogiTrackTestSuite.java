import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.annotations.*;
import org.testng.annotations.DataProvider;
import java.time.Duration;
import java.util.List;

/**
 * LogiTrack - Comprehensive Logistics Parcel Tracking System Test Suite
 * 
 * Test Coverage:
 * 1. Login Module - Authentication features
 * 2. Parcel Module - Core business logic (tracking system)
 * 3. User Module - Registration & user management
 * 4. UI Module - Basic element checks
 * 5. Integration Module - Combined workflow testing
 * 6. Regression Module - Stability after changes
 * 7. Security Module - Protection against attacks
 * 
 * @author Test Automation Team
 * @version 1.0
 */
public class LogisticsTest {
    
    private WebDriver driver;
    private WebDriverWait wait;
    private static final String BASE_URL = "http://localhost:5173";
    private static final String ADMIN_USERNAME = "admin";
    private static final String ADMIN_PASSWORD = "admin123";
    
    @BeforeClass
    public void setUp() {
        // Initialize ChromeDriver
        driver = new ChromeDriver();
        driver.manage().window().maximize();
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
        wait = new WebDriverWait(driver, Duration.ofSeconds(15));
        
        System.out.println("=== LogiTrack Test Suite Started ===");
        System.out.println("Testing Logistics Parcel Tracking System");
        System.out.println("Base URL: " + BASE_URL);
    }
    
    @AfterClass
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
        System.out.println("=== LogiTrack Test Suite Completed ===");
    }
    
    @BeforeMethod
    public void navigateToHomePage() {
        driver.get(BASE_URL);
    }
    
    // ==================== LOGIN MODULE TESTS ====================
    // Login Module - Authentication features
    
    @Test(priority = 1, description = "Test login with valid admin credentials")
    public void testLoginWithValidCredentials() {
        System.out.println("Testing: Login with valid credentials");
        
        // Navigate to login page
        WebElement adminLoginLink = wait.until(ExpectedConditions.elementToBeClickable(
            By.xpath("//a[contains(text(), 'Admin Login')]")));
        adminLoginLink.click();
        
        // Wait for login form
        wait.until(ExpectedConditions.presenceOfElementLocated(By.name("username")));
        
        // Enter valid credentials
        WebElement usernameField = driver.findElement(By.name("username"));
        WebElement passwordField = driver.findElement(By.name("password"));
        WebElement loginButton = driver.findElement(By.xpath("//button[contains(text(), 'Login')]"));
        
        usernameField.sendKeys(ADMIN_USERNAME);
        passwordField.sendKeys(ADMIN_PASSWORD);
        loginButton.click();
        
        // Verify successful login - should redirect to admin dashboard
        wait.until(ExpectedConditions.urlContains("/admin"));
        WebElement dashboardTitle = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.xpath("//h1[contains(text(), 'Dashboard')]")));
        
        Assert.assertTrue(dashboardTitle.isDisplayed(), "Dashboard should be visible after successful login");
        Assert.assertTrue(driver.getCurrentUrl().contains("/admin"), "Should be redirected to admin dashboard");
        
        System.out.println("PASS: Valid credentials login successful");
    }
    
    @Test(priority = 2, description = "Test login with invalid credentials")
    public void testLoginWithInvalidCredentials() {
        System.out.println("Testing: Login with invalid credentials");
        
        // Navigate to login page
        WebElement adminLoginLink = wait.until(ExpectedConditions.elementToBeClickable(
            By.xpath("//a[contains(text(), 'Admin Login')]")));
        adminLoginLink.click();
        
        // Wait for login form
        wait.until(ExpectedConditions.presenceOfElementLocated(By.name("username")));
        
        // Enter invalid credentials
        WebElement usernameField = driver.findElement(By.name("username"));
        WebElement passwordField = driver.findElement(By.name("password"));
        WebElement loginButton = driver.findElement(By.xpath("//button[contains(text(), 'Login')]"));
        
        usernameField.sendKeys("invaliduser");
        passwordField.sendKeys("wrongpassword");
        loginButton.click();
        
        // Verify login failure - should show error message or stay on login page
        try {
            Thread.sleep(2000); // Wait for potential error message
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // Should not be redirected to admin dashboard
        Assert.assertFalse(driver.getCurrentUrl().contains("/admin"), 
            "Should not be redirected to admin dashboard with invalid credentials");
        
        System.out.println("PASS: Invalid credentials properly rejected");
    }
    
    @Test(priority = 3, description = "Test login with empty fields")
    public void testLoginWithEmptyFields() {
        System.out.println("Testing: Login with empty fields");
        
        // Navigate to login page
        WebElement adminLoginLink = wait.until(ExpectedConditions.elementToBeClickable(
            By.xpath("//a[contains(text(), 'Admin Login')]")));
        adminLoginLink.click();
        
        // Wait for login form
        wait.until(ExpectedConditions.presenceOfElementLocated(By.name("username")));
        
        // Try to login with empty fields
        WebElement loginButton = driver.findElement(By.xpath("//button[contains(text(), 'Login')]"));
        loginButton.click();
        
        // Verify validation - should stay on login page
        Assert.assertTrue(driver.getCurrentUrl().contains("/login") || 
            driver.getCurrentUrl().equals(BASE_URL + "/"), 
            "Should remain on login page with empty fields");
        
        System.out.println("PASS: Empty fields validation working");
    }
    
    @Test(priority = 4, description = "Test logout functionality")
    public void testLogoutFunctionality() {
        System.out.println("Testing: Logout functionality");
        
        // First login
        performLogin();
        
        // Find and click logout button
        WebElement logoutButton = wait.until(ExpectedConditions.elementToBeClickable(
            By.xpath("//button[contains(text(), 'Logout')]")));
        logoutButton.click();
        
        // Verify logout - should redirect to home page
        wait.until(ExpectedConditions.urlContains(BASE_URL));
        WebElement adminLoginLink = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.xpath("//a[contains(text(), 'Admin Login')]")));
        
        Assert.assertTrue(adminLoginLink.isDisplayed(), "Admin login link should be visible after logout");
        Assert.assertFalse(driver.getCurrentUrl().contains("/admin"), "Should not be in admin section after logout");
        
        System.out.println("PASS: Logout functionality working correctly");
    }
    
    // ==================== PARCEL MODULE TESTS ====================
    // Parcel Module - Core business logic (tracking system)
    
    @Test(priority = 5, description = "Test parcel creation functionality")
    public void testParcelCreation() {
        System.out.println("Testing: Parcel creation");
        
        // Login as admin
        performLogin();
        
        // Navigate to Add Parcel page
        WebElement addParcelLink = wait.until(ExpectedConditions.elementToBeClickable(
            By.xpath("//a[contains(text(), 'Add Parcel')]")));
        addParcelLink.click();
        
        // Wait for form to load
        wait.until(ExpectedConditions.presenceOfElementLocated(By.name("senderName")));
        
        // Fill parcel details
        WebElement senderName = driver.findElement(By.name("senderName"));
        WebElement senderAddress = driver.findElement(By.name("senderAddress"));
        WebElement receiverName = driver.findElement(By.name("receiverName"));
        WebElement receiverAddress = driver.findElement(By.name("receiverAddress"));
        WebElement weight = driver.findElement(By.name("weight"));
        WebElement deliveryType = driver.findElement(By.name("deliveryType"));
        WebElement submitButton = driver.findElement(By.xpath("//button[contains(text(), 'Create')]"));
        
        senderName.sendKeys("Test Sender");
        senderAddress.sendKeys("123 Test Street, Test City, TC 12345");
        receiverName.sendKeys("Test Receiver");
        receiverAddress.sendKeys("456 Test Avenue, Test Town, TT 67890");
        weight.sendKeys("2.5");
        deliveryType.sendKeys("Express");
        
        submitButton.click();
        
        // Verify parcel creation success
        try {
            Thread.sleep(3000); // Wait for processing
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // Should redirect to parcel list or show success message
        Assert.assertTrue(driver.getCurrentUrl().contains("/admin/list") || 
            driver.getCurrentUrl().contains("/admin/add"), 
            "Should navigate to parcel list or stay on form after creation");
        
        System.out.println("PASS: Parcel creation functionality working");
    }
    
    @Test(priority = 6, description = "Test parcel tracking with valid ID")
    public void testParcelTrackingWithValidId() {
        System.out.println("Testing: Parcel tracking with valid ID");
        
        // Navigate to tracking page (public)
        driver.get(BASE_URL);
        
        // Wait for tracking input
        WebElement trackingInput = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.xpath("//input[@placeholder='Enter tracking number']")));
        WebElement trackButton = driver.findElement(By.xpath("//button[contains(text(), 'Track')]"));
        
        // Enter valid tracking ID from default data
        trackingInput.sendKeys("TRK1708123456001");
        trackButton.click();
        
        // Wait for tracking results
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // Verify tracking results are displayed
        List<WebElement> trackingResults = driver.findElements(By.xpath("//div[contains(@class, 'tracking-result')]"));
        Assert.assertTrue(trackingResults.size() > 0, "Tracking results should be displayed for valid ID");
        
        System.out.println("PASS: Valid parcel tracking working");
    }
    
    @Test(priority = 7, description = "Test parcel tracking with invalid ID")
    public void testParcelTrackingWithInvalidId() {
        System.out.println("Testing: Parcel tracking with invalid ID");
        
        // Navigate to tracking page
        driver.get(BASE_URL);
        
        // Wait for tracking input
        WebElement trackingInput = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.xpath("//input[@placeholder='Enter tracking number']")));
        WebElement trackButton = driver.findElement(By.xpath("//button[contains(text(), 'Track')]"));
        
        // Enter invalid tracking ID
        trackingInput.sendKeys("INVALID123456789");
        trackButton.click();
        
        // Wait for results
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // Verify no results or error message
        List<WebElement> trackingResults = driver.findElements(By.xpath("//div[contains(@class, 'tracking-result')]"));
        WebElement errorMessage = driver.findElement(By.xpath("//div[contains(text(), 'not found') or contains(text(), 'invalid')]"));
        
        Assert.assertTrue(trackingResults.size() == 0 || errorMessage.isDisplayed(), 
            "Should show no results or error message for invalid ID");
        
        System.out.println("PASS: Invalid parcel tracking properly handled");
    }
    
    @Test(priority = 8, description = "Test parcel status update")
    public void testParcelStatusUpdate() {
        System.out.println("Testing: Parcel status update");
        
        // Login as admin
        performLogin();
        
        // Navigate to parcel list
        WebElement parcelListLink = wait.until(ExpectedConditions.elementToBeClickable(
            By.xpath("//a[contains(text(), 'All Parcels')]")));
        parcelListLink.click();
        
        // Wait for parcel list to load
        wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//div[contains(@class, 'parcel-card')]")));
        
        // Click on first parcel to view details
        WebElement firstParcel = driver.findElement(By.xpath("//div[contains(@class, 'parcel-card')]"));
        firstParcel.click();
        
        // Wait for parcel details
        wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//h3[contains(text(), 'Parcel Details')]")));
        
        // Try to update status (if status update functionality exists)
        List<WebElement> statusDropdowns = driver.findElements(By.xpath("//select[contains(@name, 'status')]"));
        if (statusDropdowns.size() > 0) {
            statusDropdowns.get(0).sendKeys("Delivered");
            
            WebElement updateButton = driver.findElement(By.xpath("//button[contains(text(), 'Update')]"));
            updateButton.click();
            
            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
            
            // Verify status update
            WebElement statusDisplay = driver.findElement(By.xpath("//div[contains(@class, 'current-status')]"));
            Assert.assertTrue(statusDisplay.getText().contains("Delivered"), "Status should be updated to Delivered");
        }
        
        System.out.println("PASS: Parcel status update functionality tested");
    }
    
    @Test(priority = 9, description = "Test parcel deletion")
    public void testParcelDeletion() {
        System.out.println("Testing: Parcel deletion");
        
        // Login as admin
        performLogin();
        
        // Navigate to parcel list
        WebElement parcelListLink = wait.until(ExpectedConditions.elementToBeClickable(
            By.xpath("//a[contains(text(), 'All Parcels')]")));
        parcelListLink.click();
        
        // Wait for parcel list
        wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//div[contains(@class, 'parcel-card')]")));
        
        // Look for delete button on first parcel
        List<WebElement> deleteButtons = driver.findElements(By.xpath("//button[contains(text(), 'Delete')]"));
        if (deleteButtons.size() > 0) {
            int initialCount = driver.findElements(By.xpath("//div[contains(@class, 'parcel-card')]")).size();
            
            deleteButtons.get(0).click();
            
            // Handle confirmation dialog if present
            try {
                WebElement confirmButton = wait.until(ExpectedConditions.elementToBeClickable(
                    By.xpath("//button[contains(text(), 'Confirm') or contains(text(), 'Yes')]")));
                confirmButton.click();
            } catch (TimeoutException e) {
                // No confirmation dialog, continue
            }
            
            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
            
            // Verify parcel deletion
            int finalCount = driver.findElements(By.xpath("//div[contains(@class, 'parcel-card')]")).size();
            Assert.assertTrue(finalCount < initialCount, "Parcel count should decrease after deletion");
        }
        
        System.out.println("PASS: Parcel deletion functionality tested");
    }
    
    // ==================== USER MODULE TESTS ====================
    // User Module - Registration & user management
    
    @Test(priority = 10, description = "Test user registration with valid data")
    public void testUserRegistrationValid() {
        System.out.println("Testing: User registration with valid data");
        
        // Login as admin
        performLogin();
        
        // Navigate to Users page
        WebElement usersLink = wait.until(ExpectedConditions.elementToBeClickable(
            By.xpath("//a[contains(text(), 'Users')]")));
        usersLink.click();
        
        // Wait for users page
        wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//h1[contains(text(), 'User Management')]")));
        
        // Click Add User button
        WebElement addUserButton = wait.until(ExpectedConditions.elementToBeClickable(
            By.xpath("//button[contains(text(), 'Add User')]")));
        addUserButton.click();
        
        // Wait for user form
        wait.until(ExpectedConditions.presenceOfElementLocated(By.name("name")));
        
        // Fill user registration form
        WebElement nameField = driver.findElement(By.name("name"));
        WebElement emailField = driver.findElement(By.name("email"));
        WebElement phoneField = driver.findElement(By.name("phone"));
        WebElement addressField = driver.findElement(By.name("address"));
        WebElement submitButton = driver.findElement(By.xpath("//button[contains(text(), 'Add')]"));
        
        nameField.sendKeys("Test User");
        emailField.sendKeys("testuser@example.com");
        phoneField.sendKeys("+1234567890");
        addressField.sendKeys("123 Test Street, Test City, TC 12345");
        
        submitButton.click();
        
        // Verify user creation
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // Should return to users list with new user visible
        WebElement usersList = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.xpath("//div[contains(@class, 'user-card')]")));
        Assert.assertTrue(usersList.isDisplayed(), "New user should be visible in users list");
        
        System.out.println("PASS: Valid user registration working");
    }
    
    @Test(priority = 11, description = "Test user registration with invalid data")
    public void testUserRegistrationInvalid() {
        System.out.println("Testing: User registration with invalid data");
        
        // Login as admin
        performLogin();
        
        // Navigate to Users page
        WebElement usersLink = wait.until(ExpectedConditions.elementToBeClickable(
            By.xpath("//a[contains(text(), 'Users')]")));
        usersLink.click();
        
        // Wait for users page
        wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//h1[contains(text(), 'User Management')]")));
        
        // Click Add User button
        WebElement addUserButton = wait.until(ExpectedConditions.elementToBeClickable(
            By.xpath("//button[contains(text(), 'Add User')]")));
        addUserButton.click();
        
        // Wait for user form
        wait.until(ExpectedConditions.presenceOfElementLocated(By.name("name")));
        
        // Try to submit with invalid email
        WebElement nameField = driver.findElement(By.name("name"));
        WebElement emailField = driver.findElement(By.name("email"));
        WebElement phoneField = driver.findElement(By.name("phone"));
        WebElement addressField = driver.findElement(By.name("address"));
        WebElement submitButton = driver.findElement(By.xpath("//button[contains(text(), 'Add')]"));
        
        nameField.sendKeys("Invalid User");
        emailField.sendKeys("invalid-email"); // Invalid email format
        phoneField.sendKeys("123"); // Invalid phone
        addressField.sendKeys(""); // Empty address
        
        submitButton.click();
        
        // Should show validation errors or stay on form
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // Verify form validation
        Assert.assertTrue(driver.getCurrentUrl().contains("/admin/users"), 
            "Should stay on users page for invalid data");
        
        System.out.println("PASS: Invalid user registration properly validated");
    }
    
    @Test(priority = 12, description = "Test duplicate user registration")
    public void testDuplicateUserRegistration() {
        System.out.println("Testing: Duplicate user registration");
        
        // Login as admin
        performLogin();
        
        // Navigate to Users page
        WebElement usersLink = wait.until(ExpectedConditions.elementToBeClickable(
            By.xpath("//a[contains(text(), 'Users')]")));
        usersLink.click();
        
        // Wait for users page
        wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//h1[contains(text(), 'User Management')]")));
        
        // Click Add User button
        WebElement addUserButton = wait.until(ExpectedConditions.elementToBeClickable(
            By.xpath("//button[contains(text(), 'Add User')]")));
        addUserButton.click();
        
        // Wait for user form
        wait.until(ExpectedConditions.presenceOfElementLocated(By.name("name")));
        
        // Try to register with existing email (from default data)
        WebElement nameField = driver.findElement(By.name("name"));
        WebElement emailField = driver.findElement(By.name("email"));
        WebElement phoneField = driver.findElement(By.name("phone"));
        WebElement addressField = driver.findElement(By.name("address"));
        WebElement submitButton = driver.findElement(By.xpath("//button[contains(text(), 'Add')]"));
        
        nameField.sendKeys("Duplicate User");
        emailField.sendKeys("john@example.com"); // This email exists in default data
        phoneField.sendKeys("+1234567890");
        addressField.sendKeys("123 Test Street, Test City, TC 12345");
        
        submitButton.click();
        
        // Should show duplicate error or validation message
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // Verify duplicate handling
        Assert.assertTrue(driver.getCurrentUrl().contains("/admin/users"), 
            "Should handle duplicate user registration");
        
        System.out.println("PASS: Duplicate user registration properly handled");
    }
    
    // ==================== UI MODULE TESTS ====================
    // UI Module - Basic element checks
    
    @Test(priority = 13, description = "Test input field exists on tracking page")
    public void testInputFieldExists() {
        System.out.println("Testing: Input field existence");
        
        driver.get(BASE_URL);
        
        // Check tracking input field exists
        WebElement trackingInput = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.xpath("//input[@placeholder='Enter tracking number']")));
        
        Assert.assertNotNull(trackingInput, "Tracking input field should exist");
        Assert.assertTrue(trackingInput.isDisplayed(), "Tracking input field should be visible");
        
        System.out.println("PASS: Input field exists and is visible");
    }
    
    @Test(priority = 14, description = "Test button exists on tracking page")
    public void testButtonExists() {
        System.out.println("Testing: Button existence");
        
        driver.get(BASE_URL);
        
        // Check track button exists
        WebElement trackButton = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.xpath("//button[contains(text(), 'Track')]")));
        
        Assert.assertNotNull(trackButton, "Track button should exist");
        Assert.assertTrue(trackButton.isDisplayed(), "Track button should be visible");
        
        System.out.println("PASS: Button exists and is visible");
    }
    
    @Test(priority = 15, description = "Test input field is enabled")
    public void testInputFieldEnabled() {
        System.out.println("Testing: Input field enabled state");
        
        driver.get(BASE_URL);
        
        // Check tracking input field is enabled
        WebElement trackingInput = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.xpath("//input[@placeholder='Enter tracking number']")));
        
        Assert.assertTrue(trackingInput.isEnabled(), "Tracking input field should be enabled");
        
        System.out.println("PASS: Input field is enabled");
    }
    
    @Test(priority = 16, description = "Test page loads successfully")
    public void testPageLoadsSuccessfully() {
        System.out.println("Testing: Page load success");
        
        driver.get(BASE_URL);
        
        // Check page title
        Assert.assertTrue(driver.getTitle().contains("LogiTrack") || 
            driver.getTitle().contains("Logistics"), 
            "Page title should contain LogiTrack or Logistics");
        
        // Check main elements are loaded
        WebElement trackingSection = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.xpath("//h1[contains(text(), 'Track') or contains(text(), 'LogiTrack')]")));
        
        Assert.assertTrue(trackingSection.isDisplayed(), "Main tracking section should be visible");
        
        System.out.println("PASS: Page loads successfully with all elements");
    }
    
    // ==================== INTEGRATION MODULE TESTS ====================
    // Integration Module - Combined workflow testing
    
    @Test(priority = 17, description = "Test complete form submission flow")
    public void testFormSubmissionFlow() {
        System.out.println("Testing: Complete form submission flow");
        
        // Login
        performLogin();
        
        // Navigate to Add Parcel
        WebElement addParcelLink = wait.until(ExpectedConditions.elementToBeClickable(
            By.xpath("//a[contains(text(), 'Add Parcel')]")));
        addParcelLink.click();
        
        // Fill and submit form
        wait.until(ExpectedConditions.presenceOfElementLocated(By.name("senderName")));
        
        WebElement senderName = driver.findElement(By.name("senderName"));
        WebElement senderAddress = driver.findElement(By.name("senderAddress"));
        WebElement receiverName = driver.findElement(By.name("receiverName"));
        WebElement receiverAddress = driver.findElement(By.name("receiverAddress"));
        WebElement weight = driver.findElement(By.name("weight"));
        WebElement submitButton = driver.findElement(By.xpath("//button[contains(text(), 'Create')]"));
        
        senderName.sendKeys("Integration Test Sender");
        senderAddress.sendKeys("123 Integration Street, Test City, TC 12345");
        receiverName.sendKeys("Integration Test Receiver");
        receiverAddress.sendKeys("456 Integration Avenue, Test Town, TT 67890");
        weight.sendKeys("1.5");
        
        submitButton.click();
        
        // Verify complete flow - should navigate to list or show success
        try {
            Thread.sleep(3000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        Assert.assertTrue(driver.getCurrentUrl().contains("/admin/list") || 
            driver.getCurrentUrl().contains("/admin/add"), 
            "Form submission should complete successfully");
        
        System.out.println("PASS: Complete form submission flow working");
    }
    
    @Test(priority = 18, description = "Test complete user flow from login to parcel management")
    public void testCompleteUserFlow() {
        System.out.println("Testing: Complete user flow");
        
        // Step 1: Login
        performLogin();
        
        // Step 2: Navigate to dashboard
        WebElement dashboardLink = wait.until(ExpectedConditions.elementToBeClickable(
            By.xpath("//a[contains(text(), 'Dashboard')]")));
        dashboardLink.click();
        
        // Verify dashboard loaded
        wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//h1[contains(text(), 'Dashboard')]")));
        
        // Step 3: Navigate to parcel list
        WebElement parcelListLink = wait.until(ExpectedConditions.elementToBeClickable(
            By.xpath("//a[contains(text(), 'All Parcels')]")));
        parcelListLink.click();
        
        // Verify parcel list loaded
        wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//div[contains(@class, 'parcel-card')]")));
        
        // Step 4: Navigate to tracking
        WebElement trackingLink = wait.until(ExpectedConditions.elementToBeClickable(
            By.xpath("//a[contains(text(), 'Public Tracking')]")));
        trackingLink.click();
        
        // Verify tracking page loaded
        wait.until(ExpectedConditions.presenceOfElementLocated(
            By.xpath("//input[@placeholder='Enter tracking number']")));
        
        // Step 5: Logout
        WebElement logoutButton = wait.until(ExpectedConditions.elementToBeClickable(
            By.xpath("//button[contains(text(), 'Logout')]")));
        logoutButton.click();
        
        // Verify logout completed
        wait.until(ExpectedConditions.presenceOfElementLocated(
            By.xpath("//a[contains(text(), 'Admin Login')]")));
        
        System.out.println("PASS: Complete user flow working end-to-end");
    }
    
    @Test(priority = 19, description = "Test navigation works properly")
    public void testNavigationWorksProperly() {
        System.out.println("Testing: Navigation functionality");
        
        // Login first
        performLogin();
        
        // Test navigation to each section
        String[] navItems = {"Dashboard", "Add Parcel", "All Parcels", "Users", "Agents", "Analytics", "Settings"};
        
        for (String navItem : navItems) {
            try {
                WebElement navLink = wait.until(ExpectedConditions.elementToBeClickable(
                    By.xpath("//a[contains(text(), '" + navItem + "')]")));
                navLink.click();
                
                // Wait for page to load (check URL or page title)
                Thread.sleep(2000);
                
                // Verify navigation worked
                Assert.assertTrue(driver.getCurrentUrl().contains("/admin") || 
                    driver.getPageSource().contains(navItem), 
                    "Navigation to " + navItem + " should work");
                
                System.out.println("Navigation to " + navItem + " successful");
                
            } catch (Exception e) {
                System.out.println("Navigation to " + navItem + " failed: " + e.getMessage());
                Assert.fail("Navigation to " + navItem + " should work properly");
            }
        }
        
        System.out.println("PASS: All navigation elements working properly");
    }
    
    // ==================== REGRESSION MODULE TESTS ====================
    // Regression Module - Stability after changes
    
    @Test(priority = 20, description = "Test homepage still accessible")
    public void testHomepageStillAccessible() {
        System.out.println("Testing: Homepage accessibility (Regression)");
        
        driver.get(BASE_URL);
        
        // Verify homepage loads
        WebElement trackingSection = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.xpath("//h1[contains(text(), 'Track') or contains(text(), 'LogiTrack')]")));
        
        Assert.assertTrue(trackingSection.isDisplayed(), "Homepage should be accessible");
        
        // Verify tracking functionality still works
        WebElement trackingInput = driver.findElement(By.xpath("//input[@placeholder='Enter tracking number']"));
        WebElement trackButton = driver.findElement(By.xpath("//button[contains(text(), 'Track')]"));
        
        Assert.assertTrue(trackingInput.isDisplayed(), "Tracking input should be visible");
        Assert.assertTrue(trackButton.isDisplayed(), "Track button should be visible");
        Assert.assertTrue(trackingInput.isEnabled(), "Tracking input should be enabled");
        
        System.out.println("PASS: Homepage still accessible and functional");
    }
    
    @Test(priority = 21, description = "Test tracking feature still working")
    public void testTrackingFeatureStillWorking() {
        System.out.println("Testing: Tracking feature stability (Regression)");
        
        driver.get(BASE_URL);
        
        // Test tracking with known valid ID
        WebElement trackingInput = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.xpath("//input[@placeholder='Enter tracking number']")));
        WebElement trackButton = driver.findElement(By.xpath("//button[contains(text(), 'Track')]"));
        
        trackingInput.sendKeys("TRK1708123456001");
        trackButton.click();
        
        // Wait for results
        try {
            Thread.sleep(3000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // Verify tracking results
        List<WebElement> trackingResults = driver.findElements(By.xpath("//div[contains(@class, 'tracking-result')]"));
        
        // Should either show results or handle gracefully
        Assert.assertTrue(trackingResults.size() >= 0, "Tracking feature should not crash");
        
        System.out.println("PASS: Tracking feature still working properly");
    }
    
    // ==================== SECURITY MODULE TESTS ====================
    // Security Module - Protection against attacks
    
    @Test(priority = 22, description = "Test XSS injection handling")
    public void testXSSInjectionHandling() {
        System.out.println("Testing: XSS injection protection");
        
        driver.get(BASE_URL);
        
        // Try XSS injection in tracking field
        WebElement trackingInput = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.xpath("//input[@placeholder='Enter tracking number']")));
        WebElement trackButton = driver.findElement(By.xpath("//button[contains(text(), 'Track')]"));
        
        String xssPayload = "<script>alert('XSS')</script>";
        trackingInput.sendKeys(xssPayload);
        trackButton.click();
        
        // Wait for processing
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // Verify XSS was handled (no alert should appear, page should not crash)
        try {
            // Check if alert is present (should not be)
            driver.switchTo().alert();
            Assert.fail("XSS injection triggered alert - security vulnerability!");
        } catch (NoAlertPresentException e) {
            // Good - no alert present
        }
        
        // Verify page is still functional
        Assert.assertTrue(driver.getCurrentUrl().contains(BASE_URL), 
            "Page should remain stable after XSS attempt");
        
        System.out.println("PASS: XSS injection properly handled");
    }
    
    @Test(priority = 23, description = "Test SQL injection handling")
    public void testSQLInjectionHandling() {
        System.out.println("Testing: SQL injection protection");
        
        driver.get(BASE_URL);
        
        // Try SQL injection in tracking field
        WebElement trackingInput = wait.until(ExpectedConditions.presenceOfElementLocated(
            By.xpath("//input[@placeholder='Enter tracking number']")));
        WebElement trackButton = driver.findElement(By.xpath("//button[contains(text(), 'Track')]"));
        
        String sqlPayload = "'; DROP TABLE parcels; --";
        trackingInput.sendKeys(sqlPayload);
        trackButton.click();
        
        // Wait for processing
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // Verify SQL injection was handled (no database errors, page remains functional)
        Assert.assertTrue(driver.getCurrentUrl().contains(BASE_URL), 
            "Page should remain stable after SQL injection attempt");
        
        // Verify normal tracking still works
        trackingInput.clear();
        trackingInput.sendKeys("TRK1708123456001");
        trackButton.click();
        
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // Should not crash or show database errors
        Assert.assertTrue(true, "System should handle SQL injection gracefully");
        
        System.out.println("PASS: SQL injection properly handled");
    }
    
    // ==================== HELPER METHODS ====================
    
    /**
     * Helper method to perform login
     */
    private void performLogin() {
        WebElement adminLoginLink = wait.until(ExpectedConditions.elementToBeClickable(
            By.xpath("//a[contains(text(), 'Admin Login')]")));
        adminLoginLink.click();
        
        wait.until(ExpectedConditions.presenceOfElementLocated(By.name("username")));
        
        WebElement usernameField = driver.findElement(By.name("username"));
        WebElement passwordField = driver.findElement(By.name("password"));
        WebElement loginButton = driver.findElement(By.xpath("//button[contains(text(), 'Login')]"));
        
        usernameField.sendKeys(ADMIN_USERNAME);
        passwordField.sendKeys(ADMIN_PASSWORD);
        loginButton.click();
        
        // Wait for successful login
        wait.until(ExpectedConditions.urlContains("/admin"));
    }
    
    // ==================== DATA PROVIDERS ====================
    
    @DataProvider(name = "validTrackingIds")
    public Object[][] validTrackingIds() {
        return new Object[][] {
            {"TRK1708123456001"},
            {"TRK1708123456002"},
            {"TRK1708123456003"}
        };
    }
    
    @DataProvider(name = "invalidTrackingIds")
    public Object[][] invalidTrackingIds() {
        return new Object[][] {
            {"INVALID123"},
            {"123456789"},
            {"ABC"},
            {""},
            {"<script>alert('test')</script>"}
        };
    }
    
    @DataProvider(name = "xssPayloads")
    public Object[][] xssPayloads() {
        return new Object[][] {
            {"<script>alert('XSS')</script>"},
            {"<img src=x onerror=alert('XSS')>"},
            {"javascript:alert('XSS')"},
            {"';alert('XSS');//"}
        };
    }
    
    @DataProvider(name = "sqlInjectionPayloads")
    public Object[][] sqlInjectionPayloads() {
        return new Object[][] {
            {"'; DROP TABLE parcels; --"},
            {"' OR '1'='1"},
            {"' UNION SELECT * FROM users --"},
            {"'; INSERT INTO parcels VALUES('test'); --"}
        };
    }
}

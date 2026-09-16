<?php
// Set headers for CORS if needed in the future
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");

// Check if a question was submitted
if (isset($_POST['question']) && !empty($_POST['question'])) {
    
    $question = htmlspecialchars($_POST['question']);
    $screenWidth = isset($_POST['screen_width']) ? $_POST['screen_width'] : 'Unknown';
    $screenHeight = isset($_POST['screen_height']) ? $_POST['screen_height'] : 'Unknown';
    $language = isset($_POST['language']) ? $_POST['language'] : 'Unknown';
    
    // Get User IP (can be useful for identifying unique sessions, but keeping it privacy-friendly)
    $ip = $_SERVER['REMOTE_ADDR'];
    
    // Get User Agent (Browser, OS, Device)
    $userAgent = $_SERVER['HTTP_USER_AGENT'];
    
    // Timestamp
    date_default_timezone_set('Asia/Baghdad'); // Assuming Iraq time based on currency
    $date = date('Y-m-d H:i:s');
    
    // Format the log entry
    $logEntry = "=================================================\n";
    $logEntry .= "Date/Time: " . $date . "\n";
    $logEntry .= "Question: " . $question . "\n";
    $logEntry .= "Device Details: \n";
    $logEntry .= " - User-Agent: " . $userAgent . "\n";
    $logEntry .= " - Screen: " . $screenWidth . "x" . $screenHeight . "\n";
    $logEntry .= " - Language: " . $language . "\n";
    $logEntry .= " - IP Address: " . $ip . "\n";
    $logEntry .= "=================================================\n\n";
    
    // Save to file
    $file = 'questions_log.txt';
    
    // FILE_APPEND flag is used to append the content to the end of the file
    // LOCK_EX flag to prevent anyone else writing to the file at the same time
    if (file_put_contents($file, $logEntry, FILE_APPEND | LOCK_EX) !== false) {
        echo "Success";
    } else {
        echo "Error: Could not write to file.";
    }
} else {
    echo "Error: No question provided.";
}
?>

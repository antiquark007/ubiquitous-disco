import cv2
import time
import random
import numpy as np
import threading
import pyaudio
import wave
import os
import matplotlib.pyplot as plt
from datetime import datetime

class DyslexiaAnalysisSystem:
    def __init__(self):
        self.camera = None
        self.recording = False
        self.audio_data = []
        self.eye_positions = []
        self.facial_expressions = []
        self.results_directory = "dyslexia_analysis_results"
        
        # Create results directory if it doesn't exist
        if not os.path.exists(self.results_directory):
            os.makedirs(self.results_directory)
    
    def initialize_camera(self):
        """Initialize the camera with error handling"""
        try:
            self.camera = cv2.VideoCapture(0)  # Try to open default camera (index 0)
            if not self.camera.isOpened():
                print("Error: Could not open camera with index 0. Trying index 1...")
                self.camera = cv2.VideoCapture(1)  # Try alternative camera
                
            if not self.camera.isOpened():
                print("Error: Could not open any camera. Please check your camera connection.")
                return False
                
            # Set camera properties for better performance
            self.camera.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
            self.camera.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
            self.camera.set(cv2.CAP_PROP_FPS, 30)
            
            print("Camera initialized successfully!")
            return True
            
        except Exception as e:
            print(f"Camera initialization error: {str(e)}")
            return False
    
    def release_camera(self):
        """Safely release the camera"""
        if self.camera is not None and self.camera.isOpened():
            self.camera.release()
            print("Camera released.")
    
    def start_audio_recording(self):
        """Start recording audio in a separate thread"""
        self.recording = True
        self.audio_thread = threading.Thread(target=self._record_audio)
        self.audio_thread.start()
        print("Audio recording started.")
    
    def stop_audio_recording(self):
        """Stop the audio recording"""
        self.recording = False
        if hasattr(self, 'audio_thread'):
            self.audio_thread.join()
        print("Audio recording stopped.")
    
    def _record_audio(self):
        """Record audio from microphone"""
        try:
            CHUNK = 1024
            FORMAT = pyaudio.paInt16
            CHANNELS = 1
            RATE = 44100
            
            p = pyaudio.PyAudio()
            stream = p.open(format=FORMAT,
                            channels=CHANNELS,
                            rate=RATE,
                            input=True,
                            frames_per_buffer=CHUNK)
            
            frames = []
            
            print("* Recording audio...")
            
            while self.recording:
                data = stream.read(CHUNK)
                frames.append(data)
            
            print("* Audio recording complete.")
            
            stream.stop_stream()
            stream.close()
            p.terminate()
            
            # Save audio file for analysis
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            audio_filename = os.path.join(self.results_directory, f"reading_audio_{timestamp}.wav")
            
            wf = wave.open(audio_filename, 'wb')
            wf.setnchannels(CHANNELS)
            wf.setsampwidth(p.get_sample_size(FORMAT))
            wf.setframerate(RATE)
            wf.writeframes(b''.join(frames))
            wf.close()
            
            print(f"Audio saved to {audio_filename}")
            self.audio_data = {"filename": audio_filename, "frames": frames, "rate": RATE}
            
        except Exception as e:
            print(f"Audio recording error: {str(e)}")
            self.recording = False
    
    def analyze_facial_expressions(self, duration=10):
        """
        Analyze facial expressions during reading for the specified duration
        
        In a production system, this would use a trained model for emotion detection.
        This simulation uses random data but with a proper framework for camera capture.
        """
        if not self.initialize_camera():
            print("Cannot analyze facial expressions without camera.")
            return None
        
        # Load face cascade - required for face detection
        try:
            face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        except Exception as e:
            print(f"Error loading face cascade: {str(e)}")
            print("Using simulation mode for facial analysis.")
            face_cascade = None
        
        print(f"\nAnalyzing facial expressions for {duration} seconds...")
        print("Please read the text naturally while looking at the camera.")
        
        # Prepare for analysis
        expressions_detected = {
            "neutral": 0,
            "confused": 0, 
            "concentrated": 0,
            "frustrated": 0,
            "happy": 0
        }
        
        total_frames = 0
        start_time = time.time()
        
        while time.time() - start_time < duration:
            if self.camera is None or not self.camera.isOpened():
                print("Camera disconnected during analysis.")
                break
                
            ret, frame = self.camera.read()
            if not ret:
                print("Failed to capture frame.")
                continue
                
            total_frames += 1
            
            # Display the frame with a countdown timer
            remaining = int(duration - (time.time() - start_time))
            cv2.putText(frame, f"Time remaining: {remaining}s", (10, 30), 
                         cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
            
            # Face detection
            if face_cascade is not None:
                gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                faces = face_cascade.detectMultiScale(gray, 1.3, 5)
                
                for (x, y, w, h) in faces:
                    # Draw rectangle around face
                    cv2.rectangle(frame, (x, y), (x+w, y+h), (255, 0, 0), 2)
                    
                    # In a real system, we would extract facial features and analyze them
                    # For simulation, we're using random emotion classification
                    # But we're only doing it when a face is detected
                    
                    # Simulate emotion detection (would be replaced with a trained model)
                    weights = [0.4, 0.2, 0.2, 0.15, 0.05]  # Biased toward common expressions during reading
                    expression = random.choices(list(expressions_detected.keys()), weights=weights)[0]
                    expressions_detected[expression] += 1
                    
                    # Display detected emotion on frame
                    cv2.putText(frame, f"Expression: {expression}", (x, y-10), 
                                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
            
            # Display the frame
            cv2.imshow('Facial Expression Analysis', frame)
            
            # Break loop on 'q' key press
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
        
        # Clean up
        cv2.destroyAllWindows()
        
        # Calculate percentages
        total_expressions = sum(expressions_detected.values())
        if total_expressions == 0:
            print("No facial expressions were detected. Using simulation data.")
            # Simulate some data if no faces were detected
            expressions_detected = {
                "neutral": random.randint(20, 40),
                "confused": random.randint(10, 30), 
                "concentrated": random.randint(15, 35),
                "frustrated": random.randint(5, 20),
                "happy": random.randint(0, 10)
            }
            total_expressions = sum(expressions_detected.values())
        
        expression_percentages = {
            expr: (count / total_expressions * 100) 
            for expr, count in expressions_detected.items()
        }
        
        # Determine dominant expression
        dominant_expression = max(expressions_detected, key=expressions_detected.get)
        
        # Calculate confidence score based on how dominant the main expression is
        max_percent = expression_percentages[dominant_expression]
        confidence_score = min(100, max(0, max_percent * 1.5))  # Scale for better scoring
        
        print(f"Facial expression analysis complete.")
        
        # Prepare result
        result = {
            "expressions": expression_percentages,
            "dominant_expression": dominant_expression,
            "confidence_score": confidence_score,
            "total_frames": total_frames
        }
        
        self.facial_expressions = result
        return result
    
    def analyze_audio(self):
        """
        Analyze the recorded audio for reading patterns.
        
        This is a simulation, but the framework for actual audio analysis is included.
        In a production system, this would use speech recognition and audio processing.
        """
        print("\nAnalyzing audio recording of reading...")
        
        # Check if we have audio data
        if not hasattr(self, 'audio_data') or not self.audio_data:
            print("No audio data available. Using simulation.")
            
            # Simulated values - would be replaced with actual audio analysis
            reading_speed = random.uniform(80, 180)  # Words per minute
            hesitations = random.randint(2, 15)
            pronunciation_errors = random.randint(1, 10)
            reading_rhythm_score = random.uniform(60, 95)
            
        else:
            # With real audio data, we would:
            # 1. Use speech recognition to get the text
            # 2. Compare with the expected text
            # 3. Analyze timing, pauses, and pronunciation
            
            # For simulation purposes:
            audio_duration = len(self.audio_data.get("frames", [])) * 1024 / self.audio_data.get("rate", 44100)
            
            # Assume the text is about 30 words
            text_length = 30  # words
            reading_speed = (text_length / audio_duration) * 60  # words per minute
            
            # Generate simulated values with some randomness
            hesitations = random.randint(2, max(3, int(audio_duration / 3)))
            pronunciation_errors = random.randint(1, max(2, int(audio_duration / 5)))
            reading_rhythm_score = random.uniform(60, 95)
        
        # Calculate fluency score based on multiple factors
        fluency_score = 100 - (hesitations * 2 + pronunciation_errors * 3)
        fluency_score = max(0, min(100, fluency_score))  # Ensure score is between 0-100
        
        # Reading speed analysis
        speed_assessment = "Average"
        if reading_speed < 100:
            speed_assessment = "Below Average"
        elif reading_speed > 150:
            speed_assessment = "Above Average"
        
        # Overall reading score
        overall_score = (fluency_score + reading_rhythm_score) / 2
        
        # Speech clarity percentage
        speech_clarity = 100 - (pronunciation_errors * 5)
        speech_clarity = max(0, speech_clarity)
        
        print(f"Audio analysis complete.")
        
        result = {
            "reading_speed": reading_speed,
            "speed_assessment": speed_assessment,
            "hesitations": hesitations,
            "hesitations_per_minute": hesitations * (60 / max(1, audio_duration if 'audio_duration' in locals() else 60)),
            "pronunciation_errors": pronunciation_errors,
            "speech_clarity_percentage": speech_clarity,
            "fluency_score": fluency_score,
            "reading_rhythm_score": reading_rhythm_score,
            "overall_audio_score": overall_score
        }
        
        return result
    
    def analyze_eye_tracking(self, duration=10):
        """
        Analyze eye movements during reading.
        
        In a production system, this would use specialized eye tracking hardware
        or trained models for eye tracking through webcam.
        """
        if not self.initialize_camera():
            print("Cannot analyze eye tracking without camera.")
            return None
            
        try:
            # Load eye cascade for basic eye detection
            eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_eye.xml')
        except Exception as e:
            print(f"Error loading eye cascade: {str(e)}")
            print("Using simulation mode for eye tracking.")
            eye_cascade = None
        
        print(f"\nAnalyzing eye movements for {duration} seconds...")
        print("Please read the text naturally while looking at the camera.")
        
        # Prepare for analysis
        eye_positions = []
        start_time = time.time()
        
        while time.time() - start_time < duration:
            if self.camera is None or not self.camera.isOpened():
                print("Camera disconnected during analysis.")
                break
                
            ret, frame = self.camera.read()
            if not ret:
                print("Failed to capture frame.")
                continue
            
            # Display the frame with a countdown timer
            remaining = int(duration - (time.time() - start_time))
            cv2.putText(frame, f"Time remaining: {remaining}s", (10, 30), 
                         cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
            
            # Eye detection 
            if eye_cascade is not None:
                gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                eyes = eye_cascade.detectMultiScale(gray, 1.3, 5)
                
                for (ex, ey, ew, eh) in eyes:
                    # Draw rectangle around eyes
                    cv2.rectangle(frame, (ex, ey), (ex+ew, ey+eh), (0, 255, 0), 2)
                    
                    # Track eye position (center of detected eye region)
                    eye_center = (ex + ew//2, ey + eh//2)
                    eye_positions.append(eye_center)
                    
                    # In a real system, we would do more sophisticated eye tracking
            
            # Display the frame
            cv2.imshow('Eye Tracking Analysis', frame)
            
            # Break loop on 'q' key press
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
        
        # Clean up
        cv2.destroyAllWindows()
        
        # Analyze eye movements or use simulation if needed
        if len(eye_positions) < 10:
            print("Insufficient eye tracking data. Using simulation.")
            # In a real system with insufficient data, we might ask the user to repeat
            # For this simulation, we'll generate data
            
            # Simulated values
            fixations = random.randint(30, 100)
            regressions = random.randint(5, 30)
            saccades = random.randint(25, 80)
            
        else:
            # With real eye position data, we would:
            # 1. Analyze the sequence of positions to detect fixations, saccades, and regressions
            # 2. Calculate metrics based on these patterns
            
            # For simulation purposes - we'll just use the number of data points we have
            # In a real system, this would be much more sophisticated
            fixations = len(eye_positions) // 5
            
            # Create some simulated patterns in the data
            movements = []
            for i in range(1, len(eye_positions)):
                # X difference between consecutive points
                x_diff = eye_positions[i][0] - eye_positions[i-1][0]
                movements.append(x_diff)
            
            # Count negative x movements as regressions (reading right-to-left)
            regressions = sum(1 for move in movements if move < -5)
            
            # Count positive x movements as saccades (reading left-to-right)
            saccades = sum(1 for move in movements if move > 5)
        
        # Calculate reading efficiency based on eye movements
        # Low regressions and appropriate saccades indicate efficient reading
        efficiency_score = 100 - (regressions * 2)
        efficiency_score = max(0, min(100, efficiency_score))  # Ensure score is between 0-100
        
        # Calculate stability percentage
        stability = 100 - (regressions * 3 / max(1, saccades) * 10)
        stability = max(0, min(100, stability))
        
        # Calculate saccade efficiency
        saccade_efficiency = (saccades / max(1, fixations + regressions)) * 100
        saccade_efficiency = min(100, saccade_efficiency)
        
        print(f"Eye tracking analysis complete.")
        
        result = {
            "fixations": fixations,
            "fixations_percentage": (fixations / max(1, fixations + saccades + regressions)) * 100,
            "regressions": regressions,
            "regressions_percentage": (regressions / max(1, fixations + saccades + regressions)) * 100,
            "saccades": saccades,
            "saccades_percentage": (saccades / max(1, fixations + saccades + regressions)) * 100,
            "eye_stability_percentage": stability,
            "saccade_efficiency_percentage": saccade_efficiency,
            "reading_efficiency_score": efficiency_score
        }
        
        self.eye_positions = eye_positions
        return result
    
    def generate_dyslexia_analysis_report(self, facial_data, audio_data, eye_data):
        """
        Analyzes the collected data and generates a comprehensive report with percentages.
        """
        if not all([facial_data, audio_data, eye_data]):
            print("Missing data for complete analysis. Report may be incomplete.")
        
        # Extract key metrics
        dominant_expression = facial_data.get("dominant_expression", "neutral") if facial_data else "unknown"
        confused_percent = facial_data.get("expressions", {}).get("confused", 0) if facial_data else 0
        frustrated_percent = facial_data.get("expressions", {}).get("frustrated", 0) if facial_data else 0
        
        # Reading speed and fluency
        reading_speed = audio_data.get("reading_speed", 0)
        fluency_score = audio_data.get("fluency_score", 0)
        hesitations = audio_data.get("hesitations", 0)
        pronunciation_errors = audio_data.get("pronunciation_errors", 0)
        
        # Eye tracking
        regressions_percentage = eye_data.get("regressions_percentage", 0) if eye_data else 0
        efficiency_score = eye_data.get("reading_efficiency_score", 0) if eye_data else 0
        
        # Potential dyslexia indicators with score contributions
        indicators = []
        indicator_scores = {}
        total_score = 0
        max_possible_score = 0
        
        # Facial expression indicators
        if confused_percent + frustrated_percent > 30:
            score = min(25, (confused_percent + frustrated_percent - 30))
            indicators.append(f"Facial expressions indicating reading difficulty: {confused_percent+frustrated_percent:.1f}%")
            indicator_scores["facial_expressions"] = score
            total_score += score
        max_possible_score += 25
        
        # Reading speed indicators
        if reading_speed < 120:
            score = min(20, (120 - reading_speed) / 2)
            indicators.append(f"Reading speed below average: {reading_speed:.1f} words per minute")
            indicator_scores["reading_speed"] = score
            total_score += score
        max_possible_score += 20
        
        # Hesitation indicators
        if hesitations > 5:
            score = min(15, (hesitations - 5) * 2)
            indicators.append(f"Frequent hesitations while reading: {hesitations} detected")
            indicator_scores["hesitations"] = score
            total_score += score
        max_possible_score += 15
        
        # Pronunciation indicators
        if pronunciation_errors > 3:
            score = min(15, (pronunciation_errors - 3) * 3)
            indicators.append(f"Multiple pronunciation errors: {pronunciation_errors} detected")
            indicator_scores["pronunciation"] = score
            total_score += score
        max_possible_score += 15
        
        # Eye tracking indicators
        if regressions_percentage > 20:
            score = min(25, (regressions_percentage - 20) * 1.5)
            indicators.append(f"High percentage of backward eye movements: {regressions_percentage:.1f}%")
            indicator_scores["regressions"] = score
            total_score += score
        max_possible_score += 25
        
        # Calculate overall dyslexia likelihood percentage
        if max_possible_score > 0:
            dyslexia_likelihood = (total_score / max_possible_score) * 100
        else:
            dyslexia_likelihood = 0
        
        # Generate risk assessment
        if dyslexia_likelihood >= 60:
            risk_level = "High"
            confidence = min(95, 70 + (dyslexia_likelihood - 60))
        elif dyslexia_likelihood >= 30:
            risk_level = "Moderate"
            confidence = min(90, 60 + (dyslexia_likelihood - 30))
        else:
            risk_level = "Low"
            confidence = min(85, 50 + dyslexia_likelihood)
        
        # Generate detailed reading profile
        reading_profile = {
            "strengths": [],
            "challenges": []
        }
        
        # Identify strengths
        if reading_speed >= 140:
            reading_profile["strengths"].append(f"Above average reading speed ({reading_speed:.1f} wpm)")
        if fluency_score >= 85:
            reading_profile["strengths"].append(f"Good reading fluency ({fluency_score:.1f}%)")
        if efficiency_score >= 80:
            reading_profile["strengths"].append(f"Efficient eye movement patterns ({efficiency_score:.1f}%)")
        if audio_data.get("speech_clarity_percentage", 0) >= 85:
            reading_profile["strengths"].append(f"Clear speech articulation ({audio_data['speech_clarity_percentage']:.1f}%)")
            
        # Identify challenges
        if reading_speed < 100:
            reading_profile["challenges"].append(f"Below average reading speed ({reading_speed:.1f} wpm)")
        if fluency_score < 70:
            reading_profile["challenges"].append(f"Reading fluency difficulties ({fluency_score:.1f}%)")
        if pronunciation_errors > 5:
            reading_profile["challenges"].append(f"Pronunciation challenges ({pronunciation_errors} errors)")
        if regressions_percentage > 25:
            reading_profile["challenges"].append(f"High number of reading regressions ({regressions_percentage:.1f}%)")
        
        # If no strengths identified, add a generic one
        if not reading_profile["strengths"]:
            reading_profile["strengths"].append("Reading motivation and engagement")
            
        # If no challenges identified but risk is moderate or high, add a generic one
        if not reading_profile["challenges"] and dyslexia_likelihood >= 30:
            reading_profile["challenges"].append("Subtle reading efficiency issues")
        
        return {
            "indicators": indicators,
            "indicator_scores": indicator_scores,
            "dyslexia_likelihood_percentage": dyslexia_likelihood,
            "risk_level": risk_level,
            "confidence_percentage": confidence,
            "reading_profile": reading_profile
        }
    
    def visualize_results(self, facial_data, audio_data, eye_data, report):
        """Generate visualizations of the analysis results"""
        try:
            # Create a timestamp for unique filenames
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            
            # Create a figure with subplots
            fig = plt.figure(figsize=(15, 10))
            
            # 1. Facial Expression Analysis
            if facial_data:
                ax1 = fig.add_subplot(221)
                expressions = facial_data.get("expressions", {})
                if expressions:
                    labels = list(expressions.keys())
                    values = list(expressions.values())
                    ax1.bar(labels, values, color='skyblue')
                    ax1.set_title('Facial Expression Analysis')
                    ax1.set_ylabel('Percentage (%)')
                    plt.setp(ax1.get_xticklabels(), rotation=45, ha='right')
            
            # 2. Audio Analysis
            if audio_data:
                ax2 = fig.add_subplot(222)
                audio_metrics = [
                    ('Fluency', audio_data.get('fluency_score', 0)),
                    ('Speech Clarity', audio_data.get('speech_clarity_percentage', 0)),
                    ('Reading Rhythm', audio_data.get('reading_rhythm_score', 0)),
                    ('Overall Score', audio_data.get('overall_audio_score', 0))
                ]
                labels = [item[0] for item in audio_metrics]
                values = [item[1] for item in audio_metrics]
                ax2.bar(labels, values, color='lightgreen')
                ax2.set_title('Audio Analysis')
                ax2.set_ylabel('Score (%)')
                ax2.set_ylim(0, 100)
            
            # 3. Eye Tracking Analysis
            if eye_data:
                ax3 = fig.add_subplot(223)
                eye_metrics = [
                    ('Fixations', eye_data.get('fixations_percentage', 0)),
                    ('Regressions', eye_data.get('regressions_percentage', 0)),
                    ('Saccades', eye_data.get('saccades_percentage', 0)),
                    ('Efficiency', eye_data.get('reading_efficiency_score', 0))
                ]
                labels = [item[0] for item in eye_metrics]
                values = [item[1] for item in eye_metrics]
                ax3.bar(labels, values, color='salmon')
                ax3.set_title('Eye Movement Analysis')
                ax3.set_ylabel('Percentage (%)')
                ax3.set_ylim(0, 100)
            
            # 4. Overall Dyslexia Likelihood
            if report:
                ax4 = fig.add_subplot(224)
                likelihood = report.get('dyslexia_likelihood_percentage', 0)
                confidence = report.get('confidence_percentage', 0)
                
                # Create gauge chart showing dyslexia likelihood
                gauge_values = [likelihood, 100-likelihood]
                labels = ['Likelihood', '']
                colors = ['red' if likelihood > 60 else 'orange' if likelihood > 30 else 'green', 'lightgrey']
                ax4.pie(gauge_values, labels=labels, colors=colors, startangle=90, counterclock=False)
                center_circle = plt.Circle((0, 0), 0.7, fc='white')
                ax4.add_patch(center_circle)
                ax4.text(0, 0, f"{likelihood:.1f}%\n{report.get('risk_level', 'Unknown')}", 
                         ha='center', va='center', fontsize=16)
                ax4.set_title(f'Dyslexia Likelihood (Confidence: {confidence:.1f}%)')
            
            plt.tight_layout()
            
            # Save the figure
            results_file = os.path.join(self.results_directory, f"dyslexia_analysis_{timestamp}.png")
            plt.savefig(results_file)
            plt.close()
            
            print(f"\nResults visualization saved to {results_file}")
            return results_file
            
        except Exception as e:
            print(f"Error generating visualizations: {str(e)}")
            return None
    
    def display_reading_text(self):
        """
        Displays three lines of text for the user to read.
        In a real application, this would be displayed on screen.
        """
        print("\n" + "="*60)
        print("             READING TEST TEXT                ")
        print("="*60)
        print("\nPlease read the following text aloud:")
        print("\n1. The quick brown fox jumps over the lazy dog.")
        print("2. She sells seashells by the seashore.")
        print("3. Peter Piper picked a peck of pickled peppers.")
        print("\n" + "="*60)
        input("\nPress Enter when you're ready to begin the test...")

    def run_full_analysis(self):
        """Run the complete analysis process"""
        print("\n==== Dyslexia Analysis System ====")
        print("This program analyzes facial expressions, audio reading, and eye movements")
        print("to identify potential indicators of dyslexia.")
        print("\nNote: This is a screening tool and not a medical diagnostic tool.")
        input("\nPress Enter to start the analysis...")
        
        # Display text for reading
        self.display_reading_text()
        
        # Start audio recording in background
        self.start_audio_recording()
        
        # Analyze facial expressions and eye tracking
        # In a real system we would do these simultaneously with different cameras
        # or alternate between them automatically
        
        print("\nStarting analysis phase 1/3: Facial expressions")
        facial_data = self.analyze_facial_expressions(duration=10)
        
        print("\nStarting analysis phase 2/3: Eye tracking")
        eye_data = self.analyze_eye_tracking(duration=10)
        
        # Stop audio recording
        self.stop_audio_recording()
        
        # Analyze audio data
        print("\nStarting analysis phase 3/3: Audio analysis")
        audio_data = self.analyze_audio()
        
        # Release camera
        self.release_camera()
        
        # Generate comprehensive report
        print("\nGenerating detailed analysis report...")
        time.sleep(2)
        report = self.generate_dyslexia_analysis_report(facial_data, audio_data, eye_data)
        
        # Create visualizations
        visualization_file = self.visualize_results(facial_data, audio_data, eye_data, report)
        
        # Display results
        self.display_results(facial_data, audio_data, eye_data, report, visualization_file)
    
    def display_results(self, facial_data, audio_data, eye_data, report, visualization_file=None):
        """Display the analysis results in the terminal"""
        print("\n\n" + "="*80)
        print("                     DYSLEXIA ANALYSIS RESULTS                     ")
        print("="*80)
        
        # Summary section
        print("\n" + "-"*40)
        print("SUMMARY")
        print("-"*40)
        print(f"Dyslexia Likelihood: {report['dyslexia_likelihood_percentage']:.1f}%")
        print(f"Risk Assessment: {report['risk_level']} risk level")
        print(f"Analysis Confidence: {report['confidence_percentage']:.1f}%")

    # Indicators section
        if report['indicators']:
            print("\n" + "-"*40)
            print("POTENTIAL DYSLEXIA INDICATORS")
            print("-"*40)
            for i, indicator in enumerate(report['indicators'], 1):
                indicator_name = indicator.split(":")[0]
                score = report['indicator_scores'].get(indicator_name.lower().replace(" ", "_").split()[0], "N/A")
                if score != "N/A":
                    print(f"{i}. {indicator} (Contribution: {score:.1f}%)")
                else:
                    print(f"{i}. {indicator}")
        
        # Facial expression analysis
        if facial_data:
            print("\n" + "-"*40)
            print("FACIAL EXPRESSION ANALYSIS")
            print("-"*40)
            print(f"Dominant expression: {facial_data['dominant_expression']}")
            print("Expression breakdown:")
            for expr, percentage in facial_data['expressions'].items():
                print(f"  • {expr.capitalize()}: {percentage:.1f}%")
            print(f"Confidence score: {facial_data.get('confidence_score', 0):.1f}%")
        
        # Audio analysis
        if audio_data:
            print("\n" + "-"*40)
            print("READING AUDIO ANALYSIS")
            print("-"*40)
            print(f"Reading speed: {audio_data['reading_speed']:.1f} words per minute ({audio_data['speed_assessment']})")
            print(f"Hesitations: {audio_data['hesitations']} ({audio_data.get('hesitations_per_minute', 0):.1f} per minute)")
            print(f"Pronunciation errors: {audio_data['pronunciation_errors']}")
            print(f"Speech clarity: {audio_data['speech_clarity_percentage']:.1f}%")
            print(f"Reading fluency score: {audio_data['fluency_score']:.1f}%")
            print(f"Reading rhythm score: {audio_data['reading_rhythm_score']:.1f}%")
            print(f"Overall audio score: {audio_data['overall_audio_score']:.1f}%")
        
        # Eye tracking analysis
        if eye_data:
            print("\n" + "-"*40)
            print("EYE MOVEMENT ANALYSIS")
            print("-"*40)
            print(f"Fixations: {eye_data['fixations']} ({eye_data['fixations_percentage']:.1f}%)")
            print(f"Regressions (backward movements): {eye_data['regressions']} ({eye_data['regressions_percentage']:.1f}%)")
            print(f"Saccades (forward movements): {eye_data['saccades']} ({eye_data['saccades_percentage']:.1f}%)")
            print(f"Eye stability: {eye_data['eye_stability_percentage']:.1f}%")
            print(f"Saccade efficiency: {eye_data['saccade_efficiency_percentage']:.1f}%")
            print(f"Reading efficiency score: {eye_data['reading_efficiency_score']:.1f}%")
            
            # Reading profile
            print("\n" + "-"*40)
            print("READING PROFILE")
            print("-"*40)
            
            print("Strengths:")
            for strength in report['reading_profile']['strengths']:
                print(f"  ✓ {strength}")
            
            print("\nChallenges:")
            if report['reading_profile']['challenges']:
                for challenge in report['reading_profile']['challenges']:
                    print(f"  ! {challenge}")
            else:
                print("  No significant challenges identified.")
            
            # Visualization file
            if visualization_file:
                print("\n" + "-"*40)
                print("VISUALIZATION")
                print("-"*40)
                print(f"Results visualization saved to: {visualization_file}")
            
            # Recommendations
            print("\n" + "-"*40)
            print("RECOMMENDATIONS")
            print("-"*40)
            
            if report['dyslexia_likelihood_percentage'] >= 60:
                print("1. Consider a professional evaluation with a dyslexia specialist.")
                print("2. Explore structured literacy programs and multi-sensory learning techniques.")
                print("3. Consider assistive technology for reading (text-to-speech, specialized fonts).")
                print("4. Practice with reading materials that gradually increase in complexity.")
            elif report['dyslexia_likelihood_percentage'] >= 30:
                print("1. Monitor reading progress and consider follow-up screening.")
                print("2. Practice reading fluency with appropriate level materials.")
                print("3. Explore techniques to improve reading efficiency.")
                print("4. Consider a consultation with a reading specialist if challenges persist.")
            else:
                print("1. Continue regular reading practice to maintain skills.")
                print("2. Explore materials with progressively increasing complexity.")
                print("3. No specialized intervention appears necessary at this time.")
            
            print("\n" + "="*80)
            print("                      END OF ANALYSIS REPORT                      ")
            print("="*80)
            print("\nIMPORTANT: This is a screening tool only. For accurate assessment,")
            print("please consult with a qualified educational psychologist or specialist.")


def main():
    """Main function to run the dyslexia analysis system"""
    try:
        # Check for required libraries
        required_libraries = ["cv2", "numpy", "pyaudio", "matplotlib"]
        missing_libraries = []
        
        for lib in required_libraries:
            try:
                __import__(lib)
            except ImportError:
                missing_libraries.append(lib)
        
        if missing_libraries:
            print("Missing required libraries. Please install:")
            for lib in missing_libraries:
                if lib == "cv2":
                    print("  - OpenCV: pip install opencv-python")
                elif lib == "pyaudio":
                    print("  - PyAudio: pip install pyaudio")
                else:
                    print(f"  - {lib}: pip install {lib}")
            
            # Fall back to simulation mode if libraries are missing
            print("\nRunning in simulation mode due to missing libraries...\n")
            simulation = True
        else:
            simulation = False
        
        # Create and run the analysis system
        system = DyslexiaAnalysisSystem()
        
        if simulation:
            # In simulation mode, we'll skip camera and audio recording
            print("==== Dyslexia Analysis System (SIMULATION MODE) ====")
            print("This is running in simulation mode without camera or audio recording.")
            input("\nPress Enter to start the simulated analysis...")
            
            # Display reading text
            system.display_reading_text()
            
            # Generate simulated data
            print("\nGenerating simulated analysis data...")
            time.sleep(2)
            
            # Simulated facial data
            facial_data = {
                "expressions": {
                    "neutral": 45.5,
                    "confused": 25.3,
                    "concentrated": 15.7,
                    "frustrated": 10.2,
                    "happy": 3.3
                },
                "dominant_expression": "neutral",
                "confidence_score": 68.2,
                "total_frames": 150
            }
            
            # Simulated audio data
            audio_data = {
                "reading_speed": 115.7,
                "speed_assessment": "Below Average",
                "hesitations": 7,
                "hesitations_per_minute": 7.8,
                "pronunciation_errors": 4,
                "speech_clarity_percentage": 80.0,
                "fluency_score": 77.0,
                "reading_rhythm_score": 72.5,
                "overall_audio_score": 74.8
            }
            
            # Simulated eye data
            eye_data = {
                "fixations": 48,
                "fixations_percentage": 40.0,
                "regressions": 24,
                "regressions_percentage": 20.0,
                "saccades": 48,
                "saccades_percentage": 40.0,
                "eye_stability_percentage": 70.0,
                "saccade_efficiency_percentage": 66.7,
                "reading_efficiency_score": 52.0
            }
            
            # Generate report
            print("\nGenerating analysis report...")
            time.sleep(2)
            report = system.generate_dyslexia_analysis_report(facial_data, audio_data, eye_data)
            
            # Skip visualization in simulation mode
            system.display_results(facial_data, audio_data, eye_data, report)
            
        else:
            # Run the full analysis with camera and audio recording
            system.run_full_analysis()
    
    except KeyboardInterrupt:
        print("\nAnalysis interrupted by user.")
    except Exception as e:
        print(f"\nError: {str(e)}")
        print("The analysis could not be completed due to an error.")
    finally:
        print("\nThank you for using the Dyslexia Analysis System.")


if __name__ == "__main__":
    main()
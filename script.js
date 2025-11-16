// AI Configuration - Using Free Models via OpenRouter
const OPENROUTER_API_KEY = "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";

// Free Model Constants
const MODEL_DEEPSEEK = "deepseek/deepseek-chat";
const MODEL_LLAMA = "meta-llama/llama-3-8b-instruct";
const MODEL_MIXTRAL = "mistralai/mixtral-8x7b-instruct";
const MODEL_GEMINI = "google/gemini-nano";

// Default model for backward compatibility
const AI_MODEL = MODEL_DEEPSEEK;

// Supabase Initialization
const { createClient } = window.supabase;
const supabaseUrl = "https://efcarixxwxkghqgnpgto.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmY2FyaXh4d3hrZ2hxZ25wZ3RvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyMzI4OTgsImV4cCI6MjA3ODgwODg5OH0.FErmlQBupon-F52SdjPAHmBw5yrLlJ06R4LaqAlJRMs";
const supabase = createClient(supabaseUrl, supabaseKey);

// AI Memory System (localStorage) - Original
const Memory = {
    save(key, value) {
        try {
            const existing = JSON.parse(localStorage.getItem("aiMemory") || "{}");
            existing[key] = value;
            localStorage.setItem("aiMemory", JSON.stringify(existing));
        } catch (e) {
            console.error(`Error saving memory for key ${key}:`, e);
        }
    },
    
    get(key) {
        try {
            const existing = JSON.parse(localStorage.getItem("aiMemory") || "{}");
            return existing[key];
        } catch (e) {
            console.error(`Error getting memory for key ${key}:`, e);
            return null;
        }
    },
    
    getAll() {
        try {
            return JSON.parse(localStorage.getItem("aiMemory") || "{}");
        } catch (e) {
            console.error('Error getting all memories:', e);
            return {};
        }
    }
};

// Agent Memory System (Aristotle Challenge) - Enhanced memory for proactive behavior
const AgentMemory = {
    save(key, value) {
        try {
            const existing = JSON.parse(localStorage.getItem("agentMemory") || "{}");
            existing[key] = value;
            localStorage.setItem("agentMemory", JSON.stringify(existing));
        } catch (e) {
            console.error(`Error saving agent memory for key ${key}:`, e);
        }
    },
    
    get(key) {
        try {
            const existing = JSON.parse(localStorage.getItem("agentMemory") || "{}");
            return existing[key];
        } catch (e) {
            console.error(`Error getting agent memory for key ${key}:`, e);
            return null;
        }
    },
    
    getAll() {
        try {
            return JSON.parse(localStorage.getItem("agentMemory") || "{}");
        } catch (e) {
            console.error('Error getting all agent memories:', e);
            return {};
        }
    }
};

// Unified Model Wrapper - Can use any free model
async function callModel(modelName, prompt) {
    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: modelName,
                messages: [{ role: "user", content: prompt }]
            })
        });
        
        const data = await response.json();
        return data.choices?.[0]?.message?.content || "";
    } catch (error) {
        console.error(`Error calling model ${modelName}:`, error);
        return "";
    }
}

// Reusable AI Call Function - Uses Free DeepSeek Model (backward compatibility)
async function callAI(prompt) {
    return await callModel(AI_MODEL, prompt);
}

// User Profile Object
let userProfile = {
    phoneNumber: "",
    email: "",
    gender: "",
    firstName: "",
    lastName: "",
    pronouns: "",
    age: "",
    nationality: "",
    borough: "",
    citizenship: "",
    city: "",
    school1: "",
    school2: "",
    job: "",
    industry: "",
    employmentType: "",
    studyWorkStatus: "",
    interests: [],
    hobbies: "",
    mbti: "",
    communicationStyle: "",
    humorStyle: "",
    energyLevel: "",
    motivation: "",
    proudOf: "",
    goals: "",
    funFact: "",
    petPeeves: "",
    relationshipPhilosophy: "",
    relationshipIntentSentence: "",
    relationshipIntentCategory: "",
    incomeBracket: "",
    savingsRange: "",
    debt: [],
    debtAmount: "",
    spendingStyle: "",
    funBudget: "",
    datePayPreference: "",
    financialGoal: "",
    riskTolerance: "",
    importanceStability: "",
    financialPhilosophy: "",
    finance: {
        income: null,
        savings: null,
        debt: null,
        riskTolerance: "",
        financialGoal: "",
        parentsJob: ""
    },
    personality: {
        communicationStyle: "",
        conflictResolution: "",
        loveLanguage: "",
        socialEnergy: "",
        decisionMaking: "",
        values: []
    },
    aiAnalysis: {
        identifiedValues: [],
        relationshipStyle: "",
        therapistAdvice: ""
    },
    aiProfile: {
        text: "",
        voiceIntroUrl: ""
    },
    rsvp: false
};

// Current step tracking
let currentStep = 0; // 0 = landing page, 1-8 = form steps
const totalSteps = 9; // Updated after removing step 6

// Restore form values from userProfile
function restoreFormValues() {
    // Step 1: Phone Number
    if (userProfile.phoneNumber && document.getElementById("phone-number")) {
        document.getElementById("phone-number").value = userProfile.phoneNumber;
    }
    
    // Step 2: Email
    if (userProfile.email && document.getElementById("email-address")) {
        document.getElementById("email-address").value = userProfile.email;
    }
    
    // Step 3: Basic Info
    if (userProfile.gender && document.getElementById("gender")) {
        document.getElementById("gender").value = userProfile.gender;
    }
    if (userProfile.firstName && document.getElementById("firstName")) {
        document.getElementById("firstName").value = userProfile.firstName;
    }
    if (userProfile.lastName && document.getElementById("lastName")) {
        document.getElementById("lastName").value = userProfile.lastName;
    }
    if (userProfile.pronouns && document.getElementById("pronouns")) {
        document.getElementById("pronouns").value = userProfile.pronouns;
    }
    if (userProfile.age && document.getElementById("age")) {
        document.getElementById("age").value = userProfile.age;
    }
    if (userProfile.nationality && document.getElementById("nationality")) {
        document.getElementById("nationality").value = userProfile.nationality;
    }
    if (userProfile.borough && document.getElementById("borough")) {
        document.getElementById("borough").value = userProfile.borough;
    }
    
    // Step 4: School & Job
    if (userProfile.school1 && document.getElementById("school1")) {
        document.getElementById("school1").value = userProfile.school1;
    }
    if (userProfile.school2 && document.getElementById("school2")) {
        document.getElementById("school2").value = userProfile.school2;
    }
    if (userProfile.job && document.getElementById("job")) {
        document.getElementById("job").value = userProfile.job;
    }
    if (userProfile.industry && document.getElementById("industry")) {
        document.getElementById("industry").value = userProfile.industry;
    }
    if (userProfile.employmentType && document.getElementById("employmentType")) {
        document.getElementById("employmentType").value = userProfile.employmentType;
    }
    if (userProfile.studyWorkStatus && document.getElementById("studyWorkStatus")) {
        document.getElementById("studyWorkStatus").value = userProfile.studyWorkStatus;
    }
    
    // Step 4.5: More About You (Personality, Interests, Lifestyle)
    // Restore interests tags
    if (userProfile.interests && Array.isArray(userProfile.interests)) {
        document.querySelectorAll('.interest-tag').forEach(tag => {
            const interest = tag.getAttribute('data-interest');
            if (userProfile.interests.includes(interest)) {
                tag.classList.add('selected');
                tag.classList.add('bg-pink-400');
                tag.classList.add('text-white');
                tag.classList.remove('border-pink-200');
                tag.classList.add('border-pink-400');
            } else {
                tag.classList.remove('selected');
                tag.classList.remove('bg-pink-400');
                tag.classList.remove('text-white');
                tag.classList.add('border-pink-200');
                tag.classList.remove('border-pink-400');
            }
        });
    }
    if (userProfile.hobbies && document.getElementById("hobbies")) {
        document.getElementById("hobbies").value = userProfile.hobbies;
    }
    if (userProfile.mbti && document.getElementById("mbti")) {
        document.getElementById("mbti").value = userProfile.mbti;
    }
    if (userProfile.communicationStyle && document.getElementById("communicationStyle")) {
        document.getElementById("communicationStyle").value = userProfile.communicationStyle;
    }
    if (userProfile.humorStyle && document.getElementById("humorStyle")) {
        document.getElementById("humorStyle").value = userProfile.humorStyle;
    }
    if (userProfile.energyLevel && document.getElementById("energyLevel")) {
        document.getElementById("energyLevel").value = userProfile.energyLevel;
    }
    if (userProfile.motivation && document.getElementById("motivation")) {
        document.getElementById("motivation").value = userProfile.motivation;
    }
    if (userProfile.proudOf && document.getElementById("proudOf")) {
        document.getElementById("proudOf").value = userProfile.proudOf;
    }
    if (userProfile.goals && document.getElementById("goals")) {
        document.getElementById("goals").value = userProfile.goals;
    }
    if (userProfile.funFact && document.getElementById("funFact")) {
        document.getElementById("funFact").value = userProfile.funFact;
    }
    if (userProfile.petPeeves && document.getElementById("petPeeves")) {
        document.getElementById("petPeeves").value = userProfile.petPeeves;
    }
    if (userProfile.relationshipPhilosophy && document.getElementById("relationshipPhilosophy")) {
        document.getElementById("relationshipPhilosophy").value = userProfile.relationshipPhilosophy;
    }
    
    // Step Financial Profile: Financial Personality & Habits
    if (userProfile.incomeBracket && document.getElementById("incomeBracket")) {
        document.getElementById("incomeBracket").value = userProfile.incomeBracket;
    }
    if (userProfile.savingsRange && document.getElementById("savingsRange")) {
        document.getElementById("savingsRange").value = userProfile.savingsRange;
    }
    if (userProfile.debt && Array.isArray(userProfile.debt)) {
        document.querySelectorAll('.debt-checkbox').forEach(checkbox => {
            if (userProfile.debt.includes(checkbox.value)) {
                checkbox.checked = true;
            }
        });
    }
    if (userProfile.debtAmount && document.getElementById("debtAmount")) {
        document.getElementById("debtAmount").value = userProfile.debtAmount;
    }
    if (userProfile.spendingStyle && document.getElementById("spendingStyle")) {
        document.getElementById("spendingStyle").value = userProfile.spendingStyle;
    }
    if (userProfile.funBudget && document.getElementById("funBudget")) {
        document.getElementById("funBudget").value = userProfile.funBudget;
    }
    if (userProfile.datePayPreference && document.getElementById("datePayPreference")) {
        document.getElementById("datePayPreference").value = userProfile.datePayPreference;
    }
    if (userProfile.financialGoal && document.getElementById("financialGoal")) {
        document.getElementById("financialGoal").value = userProfile.financialGoal;
    }
    if (userProfile.riskTolerance && document.getElementById("riskTolerance")) {
        document.getElementById("riskTolerance").value = userProfile.riskTolerance;
    }
    if (userProfile.importanceStability && document.getElementById("importanceStability")) {
        document.getElementById("importanceStability").value = userProfile.importanceStability;
    }
    if (userProfile.financialPhilosophy && document.getElementById("financialPhilosophy")) {
        document.getElementById("financialPhilosophy").value = userProfile.financialPhilosophy;
    }
    
    // Step 5: Relationship Intent
    if (userProfile.relationshipIntentSentence && document.getElementById("relationship-intent")) {
        document.getElementById("relationship-intent").value = userProfile.relationshipIntentSentence;
    }
    
    // Step 5.5: Personality Questionnaire
    if (userProfile.personality) {
        if (userProfile.personality.communicationStyle && document.getElementById("communication-style")) {
            document.getElementById("communication-style").value = userProfile.personality.communicationStyle;
        }
        if (userProfile.personality.conflictResolution && document.getElementById("conflict-resolution")) {
            document.getElementById("conflict-resolution").value = userProfile.personality.conflictResolution;
        }
        if (userProfile.personality.loveLanguage && document.getElementById("love-language")) {
            document.getElementById("love-language").value = userProfile.personality.loveLanguage;
        }
        if (userProfile.personality.socialEnergy && document.getElementById("social-energy")) {
            document.getElementById("social-energy").value = userProfile.personality.socialEnergy;
        }
        if (userProfile.personality.decisionMaking && document.getElementById("decision-making")) {
            document.getElementById("decision-making").value = userProfile.personality.decisionMaking;
        }
    }
    
    // Step AI Profile: Restore AI-generated profile
    if (userProfile.aiProfile) {
        if (userProfile.aiProfile.text && document.getElementById("aiProfileText")) {
            document.getElementById("aiProfileText").value = userProfile.aiProfile.text;
        }
        if (userProfile.aiProfile.voiceIntroUrl && document.getElementById("voicePreview")) {
            const audioEl = document.getElementById("voicePreview");
            const previewContainer = document.getElementById("voice-preview-container");
            if (audioEl && previewContainer) {
                audioEl.src = userProfile.aiProfile.voiceIntroUrl;
                previewContainer.classList.remove("hidden");
                // Also set temp recording so it can be deleted/re-recorded
                window.tempVoiceRecording = userProfile.aiProfile.voiceIntroUrl;
            }
        }
    }
}

// Load profile from localStorage on page load
function loadProfile() {
    const saved = localStorage.getItem("marriagewebUserProfile");
    if (saved) {
        try {
            userProfile = JSON.parse(saved);
            // Backward compatibility: if legalName exists, use it as email
            if (userProfile.legalName && !userProfile.email) {
                userProfile.email = userProfile.legalName;
                }
            // Restore all form values
            restoreFormValues();
        } catch (e) {
            console.error("Error loading profile:", e);
        }
    }
}

// Save profile to localStorage
function saveProfile() {
    localStorage.setItem("marriagewebUserProfile", JSON.stringify(userProfile));
    // Also save to AI Memory
    Memory.save("userProfile", userProfile);
}

// Update progress bar
function updateProgress(step) {
    const progressContainer = document.getElementById("progress-container");
    
    // Hide progress bar on landing page (step 0)
    if (step === 0) {
        progressContainer.classList.add("hidden");
        return;
    }
    
    // Show progress bar and update for other steps
    progressContainer.classList.remove("hidden");
    const percent = Math.round((step / totalSteps) * 100);
    document.getElementById("progress-text").textContent = `Step ${step} of ${totalSteps}`;
    document.getElementById("progress-percent").textContent = `${percent}%`;
    document.getElementById("progress-bar").style.width = `${percent}%`;
}

// Navigate to a specific step
function goToStep(step) {
    // Hide ALL step sections (step-0 through step-7, and step-5-5, step-ai-profile)
    document.querySelectorAll(".step-section").forEach(section => {
        section.classList.add("hidden");
    });
    
    // Also hide special sections (marketplace, payment)
    document.getElementById("marketplace-section")?.classList.add("hidden");
    document.getElementById("payment-section")?.classList.add("hidden");
    
    // Show the requested step
    const stepElement = document.getElementById(`step-${step}`);
    if (stepElement) {
        stepElement.classList.remove("hidden");
        
        // Handle step number for progress bar
        if (step === "ai-profile") {
            currentStep = 5.6; // Between 5.5 and 7
            updateProgress(6); // Show as step 6 for progress (before final step 7)
        } else if (step === "5-5") {
            currentStep = 5.5;
            updateProgress(5);
        } else if (step === "4-5") {
            currentStep = 4.5;
            updateProgress(5); // Show as step 5 for progress
        } else if (step === "match-profile" || step === "chat" || step === "date-planner" || step === "financial-profile" || step === "model-routing") {
            // Special steps that don't need progress bar
            currentStep = step;
            // Hide progress bar for these special pages
            const progressContainer = document.getElementById("progress-container");
            if (progressContainer) {
                progressContainer.classList.add("hidden");
            }
        } else {
            currentStep = step;
            updateProgress(step);
        }
        
        // Restore form values when navigating to a step
        restoreFormValues();
        
        // If navigating to step 5, check if analysis is already shown
        if (step === 5) {
            const analysisResult = document.getElementById("analysis-result");
            const analyzeButton = document.querySelector('button[onclick="handleStep5()"]');
            if (analysisResult && !analysisResult.classList.contains("hidden")) {
                // Analysis is already shown, hide Analyze button
                if (analyzeButton) {
                    analyzeButton.style.display = 'none';
                }
            } else {
                // Analysis not shown, show Analyze button
                if (analyzeButton) {
                    analyzeButton.style.display = 'block';
                }
            }
        }
        
        // If navigating to AI Profile step, generate profile
        if (step === "ai-profile") {
            // Only generate if profile doesn't exist
            if (!userProfile.aiProfile || !userProfile.aiProfile.text) {
                generateAIProfile();
            } else {
                // Restore existing profile
                restoreFormValues();
            }
        }
        
        // If navigating to For You Page (step 7), generate proactive suggestion
        if (step === 7) {
            setTimeout(() => {
                generateProactiveSuggestion();
            }, 300);
        }
    }
}

// Legacy function name for backward compatibility
function showStep(stepNumber) {
    goToStep(stepNumber);
}

// Show a specific section by ID (for marketplace, payment, etc.)
function showSection(sectionId) {
    // Hide all steps and sections
    document.querySelectorAll(".step-section").forEach(section => {
        section.classList.add("hidden");
    });
    
    // Show the requested section
    const sectionElement = document.getElementById(sectionId);
    if (sectionElement) {
        sectionElement.classList.remove("hidden");
        // Update currentStep if it's a numbered step
        const stepMatch = sectionId.match(/step-(\d+)/);
        if (stepMatch) {
            currentStep = parseInt(stepMatch[1]);
            updateProgress(currentStep);
        } else if (sectionId === 'step-5-5') {
            currentStep = 5.5;
            updateProgress(5);
        }
        restoreFormValues();
    }
}

// Back navigation - goes to previous step
function goBack() {
    // Handle special cases for non-numeric steps
    const currentSection = document.querySelector('.step-section:not(.hidden)');
    if (currentSection) {
        if (currentSection.id === 'step-5-5') {
            showSection('step-5');
            return;
        } else if (currentSection.id === 'step-4-5') {
            goToStep(4);
            return;
        } else if (currentSection.id === 'step-5') {
            goToStep("4-5");
            return;
        } else if (currentSection.id === 'step-financial-profile') {
            goToStep("5-5");
            return;
        } else if (currentSection.id === 'step-ai-profile') {
            goToStep("financial-profile");
            return;
        } else if (currentSection.id === 'step-7') {
            goToStep("ai-profile");
            return;
        } else if (currentSection.id === 'step-chat') {
            // Hide AI assistant button when leaving chat
            const aiButton = document.getElementById("ai-assistant-button");
            const aiPanel = document.getElementById("ai-assistant-panel");
            if (aiButton) aiButton.classList.add("hidden");
            if (aiPanel) aiPanel.classList.add("hidden");
            goToStep("match-profile");
            return;
        } else if (currentSection.id === 'step-match-profile') {
            goToStep(7); // Back to For You Page
            return;
        } else if (currentSection.id === 'step-date-planner') {
            goToStep("chat");
            return;
        } else if (currentSection.id === 'step-model-routing') {
            goToStep(7); // Back to For You Page
            return;
        }
    }
    
    if (currentStep > 0) {
        goToStep(currentStep - 1);
    }
}

// Step 1: Phone Registration
function handleStep1() {
    const phoneNumber = document.getElementById("phone-number").value.trim();
    
    if (!phoneNumber) {
        alert("Please enter your phone number");
        return;
    }
    
    userProfile.phoneNumber = phoneNumber;
    saveProfile();
    goToStep(2);
}

// Step 2: Sign Up
async function handleSignUp() {
    const email = document.getElementById("email-address").value.trim();
    const password = document.getElementById("password").value;
    const messageEl = document.getElementById("auth-message");
    
    if (!email || !password) {
        messageEl.textContent = "Please fill in all fields";
        messageEl.className = "text-sm text-center text-red-500";
        return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        messageEl.textContent = "Please enter a valid email address";
        messageEl.className = "text-sm text-center text-red-500";
        return;
    }
    
    if (password.length < 6) {
        messageEl.textContent = "Password must be at least 6 characters";
        messageEl.className = "text-sm text-center text-red-500";
        return;
    }
    
    messageEl.textContent = "Creating account...";
    messageEl.className = "text-sm text-center text-pink-600";
    
    try {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password
        });
        
        if (error) {
            messageEl.textContent = `Error: ${error.message}`;
            messageEl.className = "text-sm text-center text-red-500";
            return;
        }
        
        userProfile.email = email;
        saveProfile();
        messageEl.textContent = "Account created successfully!";
        messageEl.className = "text-sm text-center text-green-600";
        
        setTimeout(() => {
            goToStep(3);
        }, 1000);
    } catch (err) {
        messageEl.textContent = `Error: ${err.message}`;
        messageEl.className = "text-sm text-center text-red-500";
    }
}

// Step 2: Sign In
async function handleSignIn() {
    const email = document.getElementById("email-address").value.trim();
    const password = document.getElementById("password").value;
    const messageEl = document.getElementById("auth-message");
    
    if (!email || !password) {
        messageEl.textContent = "Please fill in all fields";
        messageEl.className = "text-sm text-center text-red-500";
        return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        messageEl.textContent = "Please enter a valid email address";
        messageEl.className = "text-sm text-center text-red-500";
        return;
    }
    
    messageEl.textContent = "Signing in...";
    messageEl.className = "text-sm text-center text-pink-600";
    
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });
        
        if (error) {
            messageEl.textContent = `Error: ${error.message}`;
            messageEl.className = "text-sm text-center text-red-500";
            return;
        }
        
        userProfile.email = email;
        saveProfile();
        messageEl.textContent = "Signed in successfully!";
        messageEl.className = "text-sm text-center text-green-600";
        
        setTimeout(() => {
            goToStep(3);
        }, 1000);
    } catch (err) {
        messageEl.textContent = `Error: ${err.message}`;
        messageEl.className = "text-sm text-center text-red-500";
    }
}

// Step 3: Basic Info
function handleStep3() {
    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const gender = document.getElementById("gender").value;
    const pronouns = document.getElementById("pronouns").value;
    const age = document.getElementById("age").value;
    const nationality = document.getElementById("nationality").value.trim();
    const borough = document.getElementById("borough").value;
    
    if (!firstName || !lastName || !gender || !pronouns || !age || !nationality || !borough) {
        alert("Please fill in all fields");
        return;
    }
    
    userProfile.firstName = firstName;
    userProfile.lastName = lastName;
    userProfile.gender = gender;
    userProfile.pronouns = pronouns;
    userProfile.age = age;
    userProfile.nationality = nationality;
    userProfile.borough = borough;
    saveProfile();
    goToStep(4);
}

// Step 4: School & Job
function handleStep4() {
    const school1 = document.getElementById("school1").value.trim();
    const school2 = document.getElementById("school2").value.trim();
    const job = document.getElementById("job").value.trim();
    const industry = document.getElementById("industry").value;
    const employmentType = document.getElementById("employmentType").value;
    const studyWorkStatus = document.getElementById("studyWorkStatus").value;
    
    userProfile.school1 = school1;
    userProfile.school2 = school2;
    userProfile.job = job;
    userProfile.industry = industry;
    userProfile.employmentType = employmentType;
    userProfile.studyWorkStatus = studyWorkStatus;
    saveProfile();
    goToStep("4-5");
}

// Step 4.5: More About You (Personality, Interests, Lifestyle)
function handleStep4_5() {
    // Collect interests from selected tags
    const selectedInterests = [];
    document.querySelectorAll('.interest-tag.selected').forEach(tag => {
        selectedInterests.push(tag.getAttribute('data-interest'));
    });
    
    // Collect other fields
    const hobbies = document.getElementById("hobbies").value.trim();
    const mbti = document.getElementById("mbti").value;
    const communicationStyle = document.getElementById("communicationStyle").value;
    const humorStyle = document.getElementById("humorStyle").value;
    const energyLevel = document.getElementById("energyLevel").value;
    const motivation = document.getElementById("motivation").value.trim();
    const proudOf = document.getElementById("proudOf").value.trim();
    const goals = document.getElementById("goals").value.trim();
    const funFact = document.getElementById("funFact").value.trim();
    const petPeeves = document.getElementById("petPeeves").value.trim();
    const relationshipPhilosophy = document.getElementById("relationshipPhilosophy").value.trim();
    
    // Save to userProfile
    userProfile.interests = selectedInterests;
    userProfile.hobbies = hobbies;
    userProfile.mbti = mbti;
    userProfile.communicationStyle = communicationStyle;
    userProfile.humorStyle = humorStyle;
    userProfile.energyLevel = energyLevel;
    userProfile.motivation = motivation;
    userProfile.proudOf = proudOf;
    userProfile.goals = goals;
    userProfile.funFact = funFact;
    userProfile.petPeeves = petPeeves;
    userProfile.relationshipPhilosophy = relationshipPhilosophy;
    
    saveProfile();
    goToStep(5);
}

// Helper function to check if a keyword is negated
function isNegated(sentence, keyword) {
    const lowerSentence = sentence.toLowerCase();
    const keywordIndex = lowerSentence.indexOf(keyword);
    if (keywordIndex === -1) return false;
    
    // Check for negation words before the keyword (within 20 characters)
    const beforeKeyword = lowerSentence.substring(Math.max(0, keywordIndex - 20), keywordIndex);
    const negationWords = ["not", "don't", "dont", "no", "never", "isn't", "isnt", "aren't", "arent", 
                          "won't", "wont", "can't", "cant", "without", "avoid", "avoiding", "lack", "lacking"];
    
    return negationWords.some(neg => beforeKeyword.includes(neg));
}

// Step 5: AI Therapist Analysis - Enhanced with granular categories and negation handling
function analyzeRelationshipIntent(sentence) {
    const lowerSentence = sentence.toLowerCase();
    
    // FIRST: Check for explicit casual/exploring statements (these take priority)
    const casualIndicators = [
        "not looking for anything serious",
        "not interested in",
        "keep things light",
        "casual",
        "no commitment",
        "not committed",
        "without pressure",
        "spontaneous",
        "just looking for",
        "see where it goes",
        "exploring",
        "not serious",
        "don't want anything serious",
        "dont want anything serious"
    ];
    
    const hasCasualIntent = casualIndicators.some(indicator => lowerSentence.includes(indicator)) ||
                           (lowerSentence.includes("casual") && !isNegated(sentence, "casual")) ||
                           (lowerSentence.includes("not serious") && !isNegated(sentence, "not serious"));
    
    if (hasCasualIntent) {
        return "Casual / Exploring";
    }
    
    // Check for friendship first
    if ((lowerSentence.includes("friendship") || lowerSentence.includes("friend")) && 
        !isNegated(sentence, "friendship") && !isNegated(sentence, "friend")) {
        return "Friendship first";
    }
    
    // Check for marriage-minded (but only if NOT negated)
    const marriageKeywords = ["marriage", "long-term", "long term", "settle down", "settling down"];
    const hasMarriageIntent = marriageKeywords.some(keyword => 
        lowerSentence.includes(keyword) && !isNegated(sentence, keyword)
    );
    
    if (hasMarriageIntent) {
        // Determine marriage-minded subtype
        if ((lowerSentence.includes("traditional") || lowerSentence.includes("family") || lowerSentence.includes("roles") || 
             lowerSentence.includes("structure") || lowerSentence.includes("conventional")) && 
            !isNegated(sentence, "traditional") && !isNegated(sentence, "family")) {
            return "Marriage-Minded — Traditional";
        } else if ((lowerSentence.includes("equality") || lowerSentence.includes("equal") || lowerSentence.includes("partnership") || 
                   lowerSentence.includes("dual") || lowerSentence.includes("balance") || lowerSentence.includes("modern")) &&
                   !isNegated(sentence, "partnership")) {
            return "Marriage-Minded — Modern Partnership";
        } else if ((lowerSentence.includes("purpose") || lowerSentence.includes("mission") || lowerSentence.includes("aligned") || 
                   lowerSentence.includes("intentional") || lowerSentence.includes("values") || lowerSentence.includes("goals")) &&
                   !isNegated(sentence, "purpose")) {
            return "Marriage-Minded — Intentional / Purpose-Driven";
        } else if ((lowerSentence.includes("slow") || lowerSentence.includes("gradual") || lowerSentence.includes("steady") || 
                   lowerSentence.includes("take time") || lowerSentence.includes("pace")) &&
                   !isNegated(sentence, "slow")) {
            return "Marriage-Minded — Slow & Steady";
        } else if ((lowerSentence.includes("ready") || lowerSentence.includes("asap") || lowerSentence.includes("soon") || 
                   lowerSentence.includes("now") || lowerSentence.includes("actively") || lowerSentence.includes("immediately")) &&
                   !isNegated(sentence, "ready")) {
            return "Marriage-Minded — Ready to Settle";
        } else if ((lowerSentence.includes("children") || lowerSentence.includes("kids") || lowerSentence.includes("parent") || 
                   lowerSentence.includes("home") || lowerSentence.includes("family building")) &&
                   !isNegated(sentence, "children") && !isNegated(sentence, "kids")) {
            return "Marriage-Minded — Family-Oriented";
    } else {
            return "Marriage-Minded";
        }
    }
    
    // Check for serious/committed (but only if NOT negated)
    if ((lowerSentence.includes("serious") || lowerSentence.includes("committed")) && 
        !isNegated(sentence, "serious") && !isNegated(sentence, "committed")) {
        return "Long-term serious";
    }
    
    // Default
        return "Open to possibilities";
    }

// AI Therapist Analysis - Enhanced with expanded core values and deeper insights
function performTherapistAnalysis(sentence) {
    const lowerSentence = sentence.toLowerCase();
    const analysis = {
        identifiedValues: [],
        relationshipStyle: "",
        therapistAdvice: "",
        emotionalTone: "",
        idealPartnerType: "",
        firstDateScreening: "",
        strengths: []
    };
    
    // Define all possible core values organized by category
    const allValues = {
        emotional: [
            { name: "Emotional Depth", keywords: ["deep", "depth", "profound", "meaningful", "intimate", "soul"] },
            { name: "Secure Attachment", keywords: ["secure", "safe", "trust", "reliable", "dependable", "stable"] },
            { name: "Honesty & Transparency", keywords: ["honest", "transparent", "truth", "open", "authentic", "genuine", "real"] },
            { name: "Emotional Availability", keywords: ["available", "present", "attentive", "responsive", "engaged"] },
            { name: "Empathy", keywords: ["empathy", "understanding", "compassion", "caring", "supportive", "kind"] }
        ],
        relational: [
            { name: "Consistency", keywords: ["consistent", "reliable", "steady", "predictable", "dependable"] },
            { name: "Healthy Communication", keywords: ["communication", "talk", "discuss", "dialogue", "conversation", "express"] },
            { name: "Long-Term Orientation", keywords: ["long-term", "future", "forever", "lifetime", "permanent", "lasting"] },
            { name: "Loyalty & Commitment", keywords: ["loyal", "commitment", "committed", "dedicated", "faithful", "devoted"] },
            { name: "Shared Vision", keywords: ["vision", "goals", "dreams", "aspirations", "plans", "future together"] }
        ],
        growth: [
            { name: "Mutual Support", keywords: ["support", "encourage", "uplift", "help", "assist", "back"] },
            { name: "Continuous Growth", keywords: ["growth", "grow", "develop", "evolve", "improve", "learn", "progress"] },
            { name: "Purpose Alignment", keywords: ["purpose", "mission", "values", "principles", "beliefs", "aligned"] },
            { name: "Shared Ambition", keywords: ["ambition", "drive", "motivated", "goals", "achievement", "success"] }
        ],
        practical: [
            { name: "Stability & Security", keywords: ["stability", "stable", "security", "secure", "foundation", "solid"] },
            { name: "Financial Alignment", keywords: ["financial", "money", "finances", "fiscal", "economic", "budget"] },
            { name: "Planning for the Future", keywords: ["plan", "planning", "future", "ahead", "prepare", "organize"] },
            { name: "Life-Building Compatibility", keywords: ["build", "building", "create", "construct", "establish", "foundation"] },
            { name: "Family Orientation", keywords: ["family", "children", "kids", "parent", "home", "household"] }
        ],
        lifestyle: [
            { name: "Lifestyle Compatibility", keywords: ["lifestyle", "way of life", "living", "daily", "routine", "habits"] },
            { name: "Personal Boundaries", keywords: ["boundaries", "space", "independence", "autonomy", "respect", "limits"] },
            { name: "Work-Life Balance", keywords: ["balance", "work-life", "career", "job", "professional", "personal time"] },
            { name: "Shared Passions", keywords: ["passion", "interests", "hobbies", "activities", "shared", "common"] },
            { name: "Quality Time", keywords: ["time", "together", "moments", "presence", "attention", "focus"] }
        ]
    };
    
    // Score and identify values (4-6 selected) - with negation checking
    const valueScores = {};
    // Determine relationship style first (used for value selection)
    const relationshipCategory = analyzeRelationshipIntent(sentence);
    const isCasual = relationshipCategory === "Casual / Exploring";
    
    Object.values(allValues).flat().forEach(value => {
        let score = 0;
        let isNegatedValue = false;
        
        value.keywords.forEach(keyword => {
            if (lowerSentence.includes(keyword)) {
                // Check if this keyword is negated
                if (isNegated(sentence, keyword)) {
                    isNegatedValue = true;
                } else {
                    score += 1;
                }
            }
        });
        
        // Don't add values that are explicitly negated
        if (score > 0 && !isNegatedValue) {
            valueScores[value.name] = score;
        }
    });
    
    // For casual relationships, prioritize appropriate values
    if (isCasual) {
        // Add casual-appropriate values if they're mentioned
        const casualValues = {
            "Personal Boundaries": ["independence", "space", "autonomy", "freedom", "boundaries"],
            "Lifestyle Compatibility": ["lifestyle", "vibes", "experiences", "fun", "light"],
            "Quality Time": ["time", "moments", "experiences", "company"],
            "Shared Passions": ["passion", "interests", "hobbies", "activities"],
            "Honesty & Transparency": ["honest", "open", "authentic", "real", "transparent"]
        };
        
        Object.entries(casualValues).forEach(([valueName, keywords]) => {
            keywords.forEach(keyword => {
                if (lowerSentence.includes(keyword) && !isNegated(sentence, keyword)) {
                    if (!valueScores[valueName]) {
                        valueScores[valueName] = 0;
                    }
                    valueScores[valueName] += 1;
                }
            });
        });
    }
    
    // Select top 4-6 values
    const sortedValues = Object.entries(valueScores)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([name]) => name);
    
    // Ensure at least 4 values, add appropriate defaults based on relationship style
    if (sortedValues.length < 4) {
        const defaults = isCasual ? 
            ["Personal Boundaries", "Lifestyle Compatibility", "Honesty & Transparency", "Quality Time"] :
            ["Emotional Depth", "Healthy Communication", "Long-Term Orientation", "Stability & Security"];
        
        defaults.forEach(val => {
            if (!sortedValues.includes(val)) {
                sortedValues.push(val);
            }
        });
    }
    
    analysis.identifiedValues = sortedValues.slice(0, 6);
    
    // Set relationship style (already determined above)
    analysis.relationshipStyle = relationshipCategory;
    
    // Detect emotional tone
    if (lowerSentence.includes("excited") || lowerSentence.includes("ready") || lowerSentence.includes("eager") || 
        lowerSentence.includes("hopeful") || lowerSentence.includes("optimistic")) {
        analysis.emotionalTone = "Hopeful and optimistic";
    } else if (lowerSentence.includes("tired") || lowerSentence.includes("exhausted") || lowerSentence.includes("frustrated") || 
               lowerSentence.includes("disappointed") || lowerSentence.includes("done")) {
        analysis.emotionalTone = "Reflective and ready for change";
    } else if (lowerSentence.includes("calm") || lowerSentence.includes("peaceful") || lowerSentence.includes("content") || 
               lowerSentence.includes("patient") || lowerSentence.includes("steady")) {
        analysis.emotionalTone = "Calm and intentional";
    } else if (lowerSentence.includes("anxious") || lowerSentence.includes("nervous") || lowerSentence.includes("worried") || 
               lowerSentence.includes("uncertain") || lowerSentence.includes("unsure")) {
        analysis.emotionalTone = "Thoughtful and cautious";
    } else {
        analysis.emotionalTone = "Clear and intentional";
    }
    
    // Predict ideal partner type
    let partnerType = "";
    const category = relationshipCategory; // Use the already-determined category
    if (category === "Casual / Exploring") {
        partnerType = "someone who also values keeping things light and fun. They likely appreciate independence, spontaneous connections, and low-pressure interactions. They're probably not looking for heavy emotional investment or long-term commitment right now, and they value their freedom and personal space.";
    } else if (category.includes("Traditional")) {
        partnerType = "someone who values structure, clear roles, and traditional relationship dynamics. They likely prioritize family values, stability, and long-term commitment with a clear vision of partnership roles.";
    } else if (category.includes("Modern Partnership")) {
        partnerType = "an equal partner who values collaboration, shared decision-making, and emotional communication. They likely prioritize work-life balance, mutual respect, and building a partnership based on equality and shared goals.";
    } else if (category.includes("Intentional") || category.includes("Purpose-Driven")) {
        partnerType = "someone with aligned values and a clear sense of purpose. They likely share your commitment to growth, have similar life goals, and view relationships as a partnership in achieving shared missions.";
    } else if (category.includes("Slow & Steady")) {
        partnerType = "someone patient and emotionally secure who values gradual relationship development. They likely appreciate taking time to build trust, prefer stability over rushing, and value emotional security above all.";
    } else if (category.includes("Ready to Settle")) {
        partnerType = "someone who is also actively seeking commitment and ready to move forward. They likely have clear relationship goals, are ready for cohabitation or marriage, and value efficiency in finding a life partner.";
    } else if (category.includes("Family-Oriented")) {
        partnerType = "someone who shares your vision of family and home-building. They likely prioritize family values, want children or have similar family goals, and value creating a stable, nurturing home environment.";
    } else if (category === "Long-term serious") {
        partnerType = "someone who is ready for depth and commitment but values the journey. They likely appreciate meaningful connections, are emotionally mature, and want to build something substantial over time.";
    } else {
        partnerType = "someone who matches your openness and flexibility. They likely value authentic connections, are comfortable with uncertainty, and appreciate relationships that develop naturally.";
    }
    analysis.idealPartnerType = partnerType;
    
    // Generate first date screening recommendations
    let screeningTips = "";
    if (category === "Casual / Exploring") {
        screeningTips = "Be upfront about your casual intentions and see if they're on the same page. Notice if they respect your boundaries and independence. Watch for any pressure or expectations that don't align with keeping things light and fun.";
    } else if (analysis.identifiedValues.includes("Long-Term Orientation") || analysis.identifiedValues.includes("Planning for the Future")) {
        screeningTips = "Ask about their 5-year vision and what partnership means to them. Listen for alignment in life goals and relationship timelines.";
    } else if (analysis.identifiedValues.includes("Healthy Communication") || analysis.identifiedValues.includes("Emotional Availability")) {
        screeningTips = "Observe how they communicate and handle questions. Do they share openly? Can they discuss feelings? Notice if they ask about you too.";
    } else if (analysis.identifiedValues.includes("Family Orientation") || analysis.identifiedValues.includes("Life-Building Compatibility")) {
        screeningTips = "Discuss family values, lifestyle preferences, and what 'home' means to them. See if your visions of partnership and family align.";
    } else if (analysis.identifiedValues.includes("Purpose Alignment") || analysis.identifiedValues.includes("Shared Ambition")) {
        screeningTips = "Explore their values, what drives them, and their life mission. Look for shared principles and complementary goals.";
    } else if (analysis.identifiedValues.includes("Emotional Depth") || analysis.identifiedValues.includes("Secure Attachment")) {
        screeningTips = "Pay attention to emotional intelligence and how they handle vulnerability. Notice if they can engage in deeper conversations beyond surface level.";
    } else {
        screeningTips = "Focus on observing their communication style, values, and how they make you feel. Trust your intuition about compatibility and shared vision.";
    }
    analysis.firstDateScreening = screeningTips;
    
    // Generate enhanced therapist advice
    let advice = "";
    
    // Base advice by relationship style
    if (category.includes("Marriage-Minded")) {
        if (category.includes("Traditional")) {
            advice = "Your clarity about wanting a traditional partnership is valuable—it helps you attract people with similar values. Focus on finding someone who shares your vision of relationship roles and family structure. Look for partners who value stability, clear expectations, and long-term commitment with a traditional framework.";
        } else if (category.includes("Modern Partnership")) {
            advice = "You're seeking an equal partnership built on collaboration and mutual respect. This modern approach to relationships requires finding someone who values shared decision-making, emotional communication, and building a life together as true partners. Look for someone who appreciates your emphasis on equality and is ready to co-create a relationship dynamic.";
        } else if (category.includes("Intentional") || category.includes("Purpose-Driven")) {
            advice = "Your intentional approach to relationships shows maturity and self-awareness. You're not just looking for a partner—you're seeking someone aligned with your values and purpose. Focus on finding someone who shares your commitment to growth, has similar life missions, and views partnership as a collaborative journey toward shared goals.";
        } else if (category.includes("Slow & Steady")) {
            advice = "Your preference for gradual relationship development is a strength—it shows emotional intelligence and self-awareness. You value building a solid foundation before moving forward, which leads to more sustainable partnerships. Look for someone who appreciates taking time, values emotional security, and isn't in a rush to define or escalate the relationship.";
        } else if (category.includes("Ready to Settle")) {
            advice = "Your readiness to commit and settle down is clear, which is valuable for attracting like-minded partners. Be direct about your timeline and goals—this clarity helps filter for people who are also ready. Look for someone who shares your readiness and has done the internal work to be a good partner.";
        } else if (category.includes("Family-Oriented")) {
            advice = "Your focus on family and home-building shows you know what you want. This clarity helps you find partners who share your family values and vision. Look for someone who wants children (or has similar family goals), values creating a stable home, and sees partnership as the foundation for family life.";
        } else {
            advice = "You're clear about wanting marriage, which is a strength—it helps you attract people with similar goals. Focus on finding someone who shares your vision of partnership and is ready to build a life together. Look for someone who values commitment, communication, and shared growth.";
        }
    } else if (category === "Casual / Exploring") {
        advice = "You're clear about wanting to keep things light and casual, which is perfectly valid. This clarity helps you attract people with similar intentions and avoid mismatched expectations. Be upfront about your boundaries and what you're looking for—this honesty creates better connections, even casual ones. Look for people who respect your independence and share your preference for low-pressure interactions. Remember that casual doesn't mean disrespectful; you can still have meaningful, fun connections without heavy commitment.";
    } else if (category === "Long-term serious") {
        advice = "You're seeking depth and commitment in your relationships. This suggests you're ready for something meaningful. Take time to get to know potential partners on a deeper level—ask about their values, life goals, and what partnership means to them. Someone who matches your level of intentionality will appreciate your thoughtful approach.";
    } else {
        advice = "You're keeping an open mind about relationships, which shows flexibility and self-awareness. This openness can lead to wonderful connections. Focus on being present in each interaction and let relationships develop naturally while staying true to your core values.";
    }
    
    // Add value-specific advice
    if (analysis.identifiedValues.includes("Emotional Depth")) {
        advice += " Since you value emotional depth, prioritize partners who are comfortable with vulnerability and meaningful conversations.";
    }
    if (analysis.identifiedValues.includes("Healthy Communication")) {
        advice += " Your emphasis on communication is key—look for someone who is willing to have difficult conversations and work through challenges together.";
    }
    if (analysis.identifiedValues.includes("Stability & Security")) {
        advice += " Your need for stability suggests you'd benefit from partners who are reliable, consistent, and emotionally secure.";
    }
    if (analysis.identifiedValues.includes("Continuous Growth")) {
        advice += " Since you value growth, seek partners who are committed to personal development and support your journey.";
    }
    
    analysis.therapistAdvice = advice;
    
    return analysis;
}

function handleStep5() {
    const intentSentence = document.getElementById("relationship-intent").value.trim();
    
    if (!intentSentence) {
        alert("Please tell us what you're looking for");
        return;
    }
    
    userProfile.relationshipIntentSentence = intentSentence;
    const category = analyzeRelationshipIntent(intentSentence);
    userProfile.relationshipIntentCategory = category;
    
    // Perform therapist analysis
    const therapistAnalysis = performTherapistAnalysis(intentSentence);
    userProfile.aiAnalysis = {
        identifiedValues: therapistAnalysis.identifiedValues,
        relationshipStyle: therapistAnalysis.relationshipStyle,
        therapistAdvice: therapistAnalysis.therapistAdvice,
        emotionalTone: therapistAnalysis.emotionalTone,
        idealPartnerType: therapistAnalysis.idealPartnerType,
        firstDateScreening: therapistAnalysis.firstDateScreening
    };
    
    // Show detailed analysis result
    const analysisResult = document.getElementById("analysis-result");
    const analysisContent = document.getElementById("analysis-content");
    
    let analysisHTML = `
        <div class="space-y-4">
            <div class="bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg p-4 border-2 border-pink-200">
                <h4 class="font-semibold text-pink-700 mb-2 flex items-center gap-2">
                    <span>💭</span> Relationship Style
                </h4>
                <p class="text-pink-600 font-medium">${therapistAnalysis.relationshipStyle}</p>
            </div>
            
            <div class="bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg p-4 border-2 border-pink-200">
                <h4 class="font-semibold text-pink-700 mb-3 flex items-center gap-2">
                    <span>✨</span> Your Core Values
                </h4>
                <div class="flex flex-wrap gap-2 mt-2">
                    ${therapistAnalysis.identifiedValues.map(value => 
                        `<span class="px-3 py-1.5 bg-pink-200 text-pink-700 text-sm font-medium rounded-full">${value}</span>`
                    ).join('')}
                </div>
            </div>
            
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-5 border-2 border-blue-200">
                <h4 class="font-semibold text-blue-700 mb-3 flex items-center gap-2">
                    <span>🧠</span> AI Therapist Insights
                </h4>
                <div class="space-y-3 text-blue-600 text-sm leading-relaxed">
                    <div>
                        <p class="font-medium text-blue-700 mb-1">Emotional Tone:</p>
                        <p>${therapistAnalysis.emotionalTone}</p>
                    </div>
                    <div>
                        <p class="font-medium text-blue-700 mb-1">Your Ideal Partner:</p>
                        <p>${therapistAnalysis.idealPartnerType}</p>
                    </div>
                    <div>
                        <p class="font-medium text-blue-700 mb-1">First Date Screening Tip:</p>
                        <p>${therapistAnalysis.firstDateScreening}</p>
                    </div>
                    <div class="pt-2 border-t border-blue-200">
                        <p class="font-medium text-blue-700 mb-1">Therapist Advice:</p>
                        <p>${therapistAnalysis.therapistAdvice}</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    analysisContent.innerHTML = analysisHTML;
    analysisResult.classList.remove("hidden");
    
    // Save to memory
    Memory.save("aiAnalysis", userProfile.aiAnalysis);
    saveProfile();
    
    // Hide the "Analyze & Continue" button and show the "Continue to Next Step" button
    const analyzeButton = document.querySelector('button[onclick="handleStep5()"]');
    if (analyzeButton) {
        analyzeButton.style.display = 'none';
    }
}

// Function to navigate to step 5.5 after analysis is shown
function goToStep5_5() {
    goToStep("5-5");
}

// Step 5.5: Personality Questionnaire Handler
function handlePersonalityQuestionnaire() {
    const communicationStyle = document.getElementById("communication-style").value;
    const conflictResolution = document.getElementById("conflict-resolution").value;
    const loveLanguage = document.getElementById("love-language").value;
    const socialEnergy = document.getElementById("social-energy").value;
    const decisionMaking = document.getElementById("decision-making").value;
    
    if (!communicationStyle || !conflictResolution || !loveLanguage || !socialEnergy || !decisionMaking) {
        alert("Please answer all questions to help us find your best match");
        return;
    }
    
    userProfile.personality = {
        communicationStyle: communicationStyle,
        conflictResolution: conflictResolution,
        loveLanguage: loveLanguage,
        socialEnergy: socialEnergy,
        decisionMaking: decisionMaking,
        values: userProfile.aiAnalysis?.identifiedValues || []
    };
    
    // Save to memory
    Memory.save("personality", userProfile.personality);
    saveProfile();
    
    goToStep("financial-profile");
}

// Step Financial Profile: Financial Personality & Habits
function handleFinancialProfile() {
    // Collect debt checkboxes
    const debtCheckboxes = document.querySelectorAll('.debt-checkbox:checked');
    const debtTypes = Array.from(debtCheckboxes).map(cb => cb.value);
    
    // Collect other fields
    const incomeBracket = document.getElementById("incomeBracket").value;
    const savingsRange = document.getElementById("savingsRange").value;
    const debtAmount = document.getElementById("debtAmount").value.trim();
    const spendingStyle = document.getElementById("spendingStyle").value;
    const funBudget = document.getElementById("funBudget").value;
    const datePayPreference = document.getElementById("datePayPreference").value;
    const financialGoal = document.getElementById("financialGoal").value.trim();
    const riskTolerance = document.getElementById("riskTolerance").value;
    const importanceStability = document.getElementById("importanceStability").value;
    const financialPhilosophy = document.getElementById("financialPhilosophy").value.trim();
    
    // Save to userProfile
    userProfile.incomeBracket = incomeBracket;
    userProfile.savingsRange = savingsRange;
    userProfile.debt = debtTypes;
    userProfile.debtAmount = debtAmount;
    userProfile.spendingStyle = spendingStyle;
    userProfile.funBudget = funBudget;
    userProfile.datePayPreference = datePayPreference;
    userProfile.financialGoal = financialGoal;
    userProfile.riskTolerance = riskTolerance;
    userProfile.importanceStability = importanceStability;
    userProfile.financialPhilosophy = financialPhilosophy;
    
    // Also save to finance object for backward compatibility
    userProfile.finance.riskTolerance = riskTolerance;
    userProfile.finance.financialGoal = financialGoal;
    
    saveProfile();
    goToStep("ai-profile");
}

// Step AI Profile: Generate and handle AI profile
async function generateAIProfile() {
    const loadingEl = document.getElementById("ai-profile-loading");
    if (loadingEl) {
        loadingEl.classList.remove("hidden");
    }
    
    // Gather all user profile data
    const profileData = {
        name: `${userProfile.firstName} ${userProfile.lastName}`,
        age: userProfile.age,
        pronouns: userProfile.pronouns,
        gender: userProfile.gender,
        nationality: userProfile.nationality,
        borough: userProfile.borough,
        occupation: userProfile.job,
        industry: userProfile.industry,
        employmentType: userProfile.employmentType,
        studyWorkStatus: userProfile.studyWorkStatus,
        education: {
            bachelors: userProfile.school1,
            graduate: userProfile.school2
        },
        relationshipIntent: userProfile.relationshipIntentSentence,
        relationshipStyle: userProfile.relationshipIntentCategory,
        aiAnalysis: userProfile.aiAnalysis,
        personality: userProfile.personality
    };
    
    // Create prompt for AI - Natural, cohesive profile
    const prompt = `Write a natural, authentic dating profile for this person. Write it exactly as they would write it themselves — conversational, genuine, and human.

IMPORTANT GUIDELINES:
- Write in first person ("I", "me", "my")
- Use natural, everyday language — like you're texting a friend
- Vary sentence length — mix short punchy sentences with longer flowing ones
- Show personality through word choice and tone
- Be specific and concrete, not generic
- Include a bit of humor or personality quirks if it fits
- Don't use formal language or corporate speak
- Don't list things — weave everything into a story
- Make it feel like a real person wrote it, not an AI

Include these elements naturally woven throughout:
- Who they are and what they're about
- Their personality and vibe
- What they do and what they're passionate about
- What they value in relationships and life
- What they're looking for in a partner
- What makes them unique or interesting
- A warm, inviting closing

Write 4-6 paragraphs that flow naturally. Make it feel like you're getting to know a real person.

User data:
${JSON.stringify(profileData)}

Return ONLY the profile text. No labels, no headers, no formatting. Just pure, natural, human-written-sounding text.`;

    try {
        console.log('Starting AI profile generation...');
        console.log('Profile data being sent:', profileData);
        console.log('Using AI model:', AI_MODEL);
        
        // Call AI using the reusable callAI function
        const aiResponse = await callAI(prompt);
        
        // Clean up response (remove markdown code blocks if present)
        let profileText = aiResponse;
        if (profileText.includes('```')) {
            profileText = profileText.split('```').filter((part, index) => index % 2 === 1).join('').trim();
        }
        // Remove any remaining markdown or formatting
        profileText = profileText.replace(/^#+\s*/gm, '').trim();
        
        console.log('Generated profile text:', profileText);
        
        // Fill the single textarea
        const profileTextarea = document.getElementById("aiProfileText");
        if (profileTextarea) {
            profileTextarea.value = profileText;
        }
        
    } catch (error) {
        console.error("Error generating AI profile:", error);
        console.error("Error details:", error.message);
        console.error("Full error object:", error);
        // Fallback: Generate profile from existing data
        generateFallbackProfile();
    } finally {
        if (loadingEl) {
            loadingEl.classList.add("hidden");
        }
    }
}

// Fallback profile generation if AI API fails
function generateFallbackProfile() {
    const firstName = userProfile.firstName || "You";
    const age = userProfile.age || "";
    const occupation = userProfile.job || "professional";
    const borough = userProfile.borough || "NYC";
    const relationshipStyle = userProfile.relationshipIntentCategory || "meaningful connection";
    const values = userProfile.aiAnalysis?.identifiedValues?.slice(0, 3).join(", ") || "authentic connections";
    const interests = (userProfile.interests || []).slice(0, 3).join(", ") || "exploring new things";
    const funFact = userProfile.funFact || "";
    
    const fallbackProfile = `Hey! I'm ${firstName}${age ? `, ${age}` : ''}. I work as a ${occupation} here in ${borough}, and I love what I do. 

I'm really into ${interests}. ${funFact ? funFact + ' ' : ''}When I'm not working, you'll probably find me exploring the city or trying out new spots.

I'm looking for ${relationshipStyle}. I value ${values}, and I think those things matter when you're building something real with someone. I want to find someone who gets that too — someone who's ${userProfile.aiAnalysis?.idealPartnerType || 'genuine, kind, and knows what they want'}.

If that sounds like you, let's chat!`;
    
    const profileTextarea = document.getElementById("aiProfileText");
    if (profileTextarea) {
        profileTextarea.value = fallbackProfile;
    }
}

function handleAIProfile() {
    const profileText = document.getElementById("aiProfileText").value.trim();
    
    if (!profileText) {
        alert("Please fill in your profile");
        return;
    }
    
    userProfile.aiProfile = {
        text: profileText,
        voiceIntroUrl: userProfile.aiProfile?.voiceIntroUrl || ""
    };
    
    // Save to memory
    Memory.save("aiProfile", userProfile.aiProfile);
    saveProfile();
    
    goToStep(7);
    generateMatches();
}

// Voice Recording Variables
let mediaRecorder = null;
let audioChunks = [];
let recordingTimer = null;
let recordingStartTime = null;

// Start Voice Recording
async function startRecording() {
    try {
        // Clear any existing temp recording
        if (window.tempVoiceRecording) {
            URL.revokeObjectURL(window.tempVoiceRecording);
            window.tempVoiceRecording = null;
        }
        
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];
        
        mediaRecorder.ondataavailable = event => {
            if (event.data.size > 0) {
                audioChunks.push(event.data);
            }
        };
        
        mediaRecorder.onstop = async () => {
            const blob = new Blob(audioChunks, { type: "audio/webm" });
            audioChunks = [];
            
            // Convert to URL for playback
            const audioUrl = URL.createObjectURL(blob);
            const audioEl = document.getElementById("voicePreview");
            const previewContainer = document.getElementById("voice-preview-container");
            
            // Store temporarily (not saved yet)
            if (!window.tempVoiceRecording) {
                window.tempVoiceRecording = audioUrl;
            } else {
                // Clean up old temp recording
                URL.revokeObjectURL(window.tempVoiceRecording);
                window.tempVoiceRecording = audioUrl;
            }
            
            audioEl.src = audioUrl;
            previewContainer.classList.remove("hidden");
            
            // Stop all tracks
            stream.getTracks().forEach(track => track.stop());
        };
        
        mediaRecorder.start();
        
        // Update UI
        document.getElementById("recordBtn").disabled = true;
        document.getElementById("stopBtn").disabled = false;
        document.getElementById("recording-timer").classList.remove("hidden");
        
        // Start timer
        recordingStartTime = Date.now();
        recordingTimer = setInterval(() => {
            const elapsed = Math.floor((Date.now() - recordingStartTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            document.getElementById("timer-display").textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            
            // Stop at 1 minute
            if (elapsed >= 60) {
                stopRecording();
            }
        }, 1000);
        
    } catch (error) {
        console.error("Error accessing microphone:", error);
        alert("Could not access microphone. Please check your permissions.");
    }
}

// Stop Voice Recording
function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
        mediaRecorder.stop();
    }
    
    // Update UI
    document.getElementById("recordBtn").disabled = false;
    document.getElementById("stopBtn").disabled = true;
    document.getElementById("recording-timer").classList.add("hidden");
    
    // Stop timer
    if (recordingTimer) {
        clearInterval(recordingTimer);
        recordingTimer = null;
    }
}

// Save Voice Recording
function saveVoiceRecording() {
    if (window.tempVoiceRecording) {
        // Save to userProfile
        userProfile.aiProfile = userProfile.aiProfile || {};
        userProfile.aiProfile.voiceIntroUrl = window.tempVoiceRecording;
        
        // Save to localStorage
        saveProfile();
        Memory.save("aiProfile", userProfile.aiProfile);
        
        // Show success message
        const previewContainer = document.getElementById("voice-preview-container");
        const successMsg = document.createElement("div");
        successMsg.className = "mt-2 text-green-600 text-sm font-medium";
        successMsg.textContent = "✅ Voice recording saved!";
        previewContainer.appendChild(successMsg);
        
        setTimeout(() => {
            successMsg.remove();
        }, 3000);
    }
}

// Delete Voice Recording
function deleteVoiceRecording() {
    if (confirm("Are you sure you want to delete this recording?")) {
        // Clean up temp recording
        if (window.tempVoiceRecording) {
            URL.revokeObjectURL(window.tempVoiceRecording);
            window.tempVoiceRecording = null;
        }
        
        // Remove from userProfile if it was saved
        if (userProfile.aiProfile && userProfile.aiProfile.voiceIntroUrl) {
            // Clean up old URL if it exists
            if (userProfile.aiProfile.voiceIntroUrl.startsWith('blob:')) {
                URL.revokeObjectURL(userProfile.aiProfile.voiceIntroUrl);
            }
            userProfile.aiProfile.voiceIntroUrl = "";
            saveProfile();
            Memory.save("aiProfile", userProfile.aiProfile);
        }
        
        // Hide preview container
        const previewContainer = document.getElementById("voice-preview-container");
        const audioEl = document.getElementById("voicePreview");
        previewContainer.classList.add("hidden");
        audioEl.src = "";
    }
}

// Calculate Financial Compatibility Score between two users
function calculateFinancialCompatibility(user1, user2) {
    let score = 0;
    let maxScore = 0;
    
    // Income bracket compatibility (15 points)
    maxScore += 15;
    if (user1.incomeBracket && user2.incomeBracket) {
        const incomeBrackets = ["< $30k", "$30k–50k", "$50k–80k", "$80k–120k", "$120k–200k", "$200k+"];
        const user1Index = incomeBrackets.indexOf(user1.incomeBracket);
        const user2Index = incomeBrackets.indexOf(user2.incomeBracket);
        if (user1Index !== -1 && user2Index !== -1) {
            const diff = Math.abs(user1Index - user2Index);
            if (diff === 0) score += 15;
            else if (diff === 1) score += 12;
            else if (diff === 2) score += 8;
            else if (diff === 3) score += 5;
            else score += 2;
        }
    }
    
    // Spending style compatibility (15 points)
    maxScore += 15;
    if (user1.spendingStyle && user2.spendingStyle) {
        if (user1.spendingStyle === user2.spendingStyle) {
            score += 15;
        } else {
            // Compatible pairs
            const compatiblePairs = [
                ["Frugal", "Balanced"],
                ["Balanced", "Occasional splurger"],
                ["Occasional splurger", "High-spender"]
            ];
            const isCompatible = compatiblePairs.some(pair => 
                (pair[0] === user1.spendingStyle && pair[1] === user2.spendingStyle) ||
                (pair[1] === user1.spendingStyle && pair[0] === user2.spendingStyle)
            );
            if (isCompatible) score += 10;
            else score += 5;
        }
    }
    
    // Fun budget compatibility (10 points)
    maxScore += 10;
    if (user1.funBudget && user2.funBudget) {
        const budgets = ["$0–$100", "$100–300", "$300–600", "$600–1000", "$1000+"];
        const user1Index = budgets.indexOf(user1.funBudget);
        const user2Index = budgets.indexOf(user2.funBudget);
        if (user1Index !== -1 && user2Index !== -1) {
            const diff = Math.abs(user1Index - user2Index);
            if (diff === 0) score += 10;
            else if (diff === 1) score += 7;
            else if (diff === 2) score += 4;
            else score += 2;
        }
    }
    
    // Risk tolerance compatibility (10 points)
    maxScore += 10;
    if (user1.riskTolerance && user2.riskTolerance) {
        if (user1.riskTolerance === user2.riskTolerance) {
            score += 10;
        } else {
            const riskLevels = ["Very cautious", "Cautious", "Moderate", "Risk-tolerant", "Very risk-taking"];
            const user1Index = riskLevels.indexOf(user1.riskTolerance);
            const user2Index = riskLevels.indexOf(user2.riskTolerance);
            if (user1Index !== -1 && user2Index !== -1) {
                const diff = Math.abs(user1Index - user2Index);
                if (diff === 1) score += 7;
                else if (diff === 2) score += 4;
                else score += 2;
            }
        }
    }
    
    // Debt compatibility (10 points)
    maxScore += 10;
    if (user1.debt && user2.debt) {
        const user1Debt = Array.isArray(user1.debt) ? user1.debt : [];
        const user2Debt = Array.isArray(user2.debt) ? user2.debt : [];
        if (user1Debt.includes("No debt") && user2Debt.includes("No debt")) {
            score += 10;
        } else if (user1Debt.includes("No debt") || user2Debt.includes("No debt")) {
            score += 5;
        } else {
            // Both have debt - check if similar types
            const commonDebt = user1Debt.filter(d => user2Debt.includes(d));
            if (commonDebt.length > 0) score += 8;
            else score += 5;
        }
    }
    
    // Importance of stability alignment (10 points)
    maxScore += 10;
    if (user1.importanceStability && user2.importanceStability) {
        if (user1.importanceStability === user2.importanceStability) {
            score += 10;
        } else {
            const importanceLevels = ["Not very", "Somewhat important", "Important", "Very important"];
            const user1Index = importanceLevels.indexOf(user1.importanceStability);
            const user2Index = importanceLevels.indexOf(user2.importanceStability);
            if (user1Index !== -1 && user2Index !== -1) {
                const diff = Math.abs(user1Index - user2Index);
                if (diff === 1) score += 7;
                else if (diff === 2) score += 4;
                else score += 2;
            }
        }
    }
    
    // Date payment preference compatibility (10 points)
    maxScore += 10;
    if (user1.datePayPreference && user2.datePayPreference) {
        if (user1.datePayPreference === user2.datePayPreference) {
            score += 10;
        } else if (user1.datePayPreference === "Flexible" || user2.datePayPreference === "Flexible") {
            score += 8;
        } else {
            // Check for compatible pairs
            const compatiblePairs = [
                ["Always 50/50", "Flexible"],
                ["Whoever initiates pays", "Flexible"],
                ["I prefer traditional roles", "Flexible"]
            ];
            const isCompatible = compatiblePairs.some(pair => 
                (pair[0] === user1.datePayPreference && pair[1] === user2.datePayPreference) ||
                (pair[1] === user1.datePayPreference && pair[0] === user2.datePayPreference)
            );
            if (isCompatible) score += 6;
            else score += 3;
        }
    }
    
    // Financial goals similarity (10 points) - simple text similarity
    maxScore += 10;
    if (user1.financialGoal && user2.financialGoal) {
        const goal1 = user1.financialGoal.toLowerCase();
        const goal2 = user2.financialGoal.toLowerCase();
        const commonWords = goal1.split(/\s+/).filter(word => goal2.includes(word));
        if (commonWords.length >= 2) score += 10;
        else if (commonWords.length === 1) score += 6;
        else score += 3;
    }
    
    // Savings range compatibility (10 points)
    maxScore += 10;
    if (user1.savingsRange && user2.savingsRange) {
        const savingsRanges = ["< $1k", "$1k–$5k", "$5k–$20k", "$20k–$50k", "$50k+"];
        const user1Index = savingsRanges.indexOf(user1.savingsRange);
        const user2Index = savingsRanges.indexOf(user2.savingsRange);
        if (user1Index !== -1 && user2Index !== -1) {
            const diff = Math.abs(user1Index - user2Index);
            if (diff === 0) score += 10;
            else if (diff === 1) score += 7;
            else if (diff === 2) score += 4;
            else score += 2;
        }
    }
    
    return maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
}

// Calculate Personality Compatibility Score between two users (renamed from calculateCompatibilityScore)
function calculatePersonalityCompatibility(user1, user2) {
    let score = 0;
    let maxScore = 0;
    
    // Communication Style Compatibility (20 points)
    maxScore += 20;
    if (user1.personality?.communicationStyle && user2.personality?.communicationStyle) {
        const comm1 = user1.personality.communicationStyle;
        const comm2 = user2.personality.communicationStyle;
        // Compatible pairs
        if ((comm1 === "Direct" && comm2 === "Direct") || 
            (comm1 === "Diplomatic" && comm2 === "Diplomatic") ||
            (comm1 === "Expressive" && comm2 === "Expressive") ||
            (comm1 === "Analytical" && comm2 === "Analytical")) {
            score += 20;
        } else if ((comm1 === "Direct" && comm2 === "Diplomatic") ||
                   (comm1 === "Expressive" && comm2 === "Analytical")) {
            score += 10; // Partial compatibility
        }
    }
    
    // Conflict Resolution Compatibility (20 points)
    maxScore += 20;
    if (user1.personality?.conflictResolution && user2.personality?.conflictResolution) {
        const conflict1 = user1.personality.conflictResolution;
        const conflict2 = user2.personality.conflictResolution;
        if (conflict1 === conflict2) {
            score += 20;
        } else if ((conflict1 === "Address Immediately" && conflict2 === "Take Time") ||
                   (conflict1 === "Compromise" && conflict2 !== "Avoid")) {
            score += 10;
        }
    }
    
    // Love Language Compatibility (20 points)
    maxScore += 20;
    if (user1.personality?.loveLanguage && user2.personality?.loveLanguage) {
        if (user1.personality.loveLanguage === user2.personality.loveLanguage) {
            score += 20;
        } else {
            // Some combinations are more compatible
            const compatiblePairs = [
                ["Words of Affirmation", "Quality Time"],
                ["Acts of Service", "Physical Touch"],
                ["Quality Time", "Physical Touch"]
            ];
            const pair = [user1.personality.loveLanguage, user2.personality.loveLanguage].sort();
            if (compatiblePairs.some(p => p.sort().join() === pair.join())) {
                score += 15;
            } else {
                score += 8;
            }
        }
    }
    
    // Social Energy Compatibility (20 points)
    maxScore += 20;
    if (user1.personality?.socialEnergy && user2.personality?.socialEnergy) {
        const energy1 = user1.personality.socialEnergy;
        const energy2 = user2.personality.socialEnergy;
        if (energy1 === energy2) {
            score += 20;
        } else if (energy1 === "Ambivert" || energy2 === "Ambivert") {
            score += 15; // Ambiverts are flexible
        } else if ((energy1 === "Introvert" && energy2 === "Extrovert") ||
                   (energy1 === "Extrovert" && energy2 === "Introvert")) {
            score += 8; // Opposites can work but need understanding
        }
    }
    
    // Decision Making Compatibility (20 points)
    maxScore += 20;
    if (user1.personality?.decisionMaking && user2.personality?.decisionMaking) {
        const decision1 = user1.personality.decisionMaking;
        const decision2 = user2.personality.decisionMaking;
        if (decision1 === decision2) {
            score += 20;
        } else if ((decision1 === "Collaborative" || decision2 === "Collaborative")) {
            score += 15; // Collaborative people work well with others
        } else if ((decision1 === "Intuitive" && decision2 === "Analytical") ||
                   (decision1 === "Analytical" && decision2 === "Intuitive")) {
            score += 10; // Can balance each other
        }
    }
    
    // Calculate percentage
    const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
    return {
        score: score,
        maxScore: maxScore,
        percentage: percentage,
        level: percentage >= 80 ? "Excellent" : 
               percentage >= 60 ? "Good" : 
               percentage >= 40 ? "Moderate" : "Fair"
    };
}

// Step 6 removed - navigation now goes directly from AI Profile to Step 7

// Step 7: Generate Matches
function generateMatches() {
    const matchesContainer = document.getElementById("matches-container");
    matchesContainer.innerHTML = "";
    
    // Hardcoded example profiles
    const exampleProfiles = [
        {
            name: "Alex",
            age: 28,
            bio: "Software engineer passionate about building meaningful connections.",
            intent: "Long-term serious",
            city: "New York",
            borough: "Manhattan",
            education: "NYU",
            occupation: "Software Engineer",
            job: "Software Engineer",
            school1: "NYU",
            values: ["Honesty & Transparency", "Long-Term Orientation", "Shared Vision"],
            coreValues: ["Honesty & Transparency", "Long-Term Orientation", "Shared Vision"],
            mbti: "INTJ",
            funFact: "Love hiking and photography",
            interests: ["Tech / Coding", "Hiking", "Photography"],
            userId: "alex123",
            incomeBracket: "$80k–120k",
            savingsRange: "$20k–$50k",
            debt: ["Student loans"],
            spendingStyle: "Balanced",
            funBudget: "$300–600",
            datePayPreference: "Always 50/50",
            financialGoal: "Buy a home and travel",
            riskTolerance: "Moderate",
            importanceStability: "Important"
        },
        {
            name: "Jordan",
            age: 26,
            bio: "Looking for someone to share life's adventures with.",
            intent: "Marriage-minded",
            city: "New York",
            borough: "Brooklyn",
            education: "Columbia University",
            occupation: "Marketing Manager",
            job: "Marketing Manager",
            school1: "Columbia University",
            values: ["Emotional Depth", "Loyalty & Commitment", "Family Orientation"],
            coreValues: ["Emotional Depth", "Loyalty & Commitment", "Family Orientation"],
            mbti: "ENFP",
            funFact: "Avid traveler and foodie",
            interests: ["Travel", "Cooking", "Museums"],
            userId: "jordan456",
            incomeBracket: "$50k–80k",
            savingsRange: "$5k–$20k",
            debt: ["Student loans"],
            spendingStyle: "Occasional splurger",
            funBudget: "$300–600",
            datePayPreference: "Flexible",
            financialGoal: "Travel and save for future",
            riskTolerance: "Risk-tolerant",
            importanceStability: "Somewhat important"
        },
        {
            name: "Taylor",
            age: 30,
            bio: "Creative professional seeking a genuine connection.",
            intent: "Long-term serious",
            city: "Brooklyn",
            borough: "Brooklyn",
            education: "Pratt Institute",
            occupation: "Graphic Designer",
            job: "Graphic Designer",
            school1: "Pratt Institute",
            values: ["Creative Expression", "Work-Life Balance", "Quality Time"],
            coreValues: ["Creative Expression", "Work-Life Balance", "Quality Time"],
            mbti: "ISFP",
            funFact: "Love art galleries and live music",
            interests: ["Film / TV", "Music", "Concerts"],
            userId: "taylor789",
            incomeBracket: "$50k–80k",
            savingsRange: "$1k–$5k",
            debt: ["No debt"],
            spendingStyle: "Frugal",
            funBudget: "$100–300",
            datePayPreference: "Whoever initiates pays",
            financialGoal: "Financial independence",
            riskTolerance: "Cautious",
            importanceStability: "Very important"
        }
    ];
    
    // Filter matches based on user's city and intent
    let filteredProfiles = exampleProfiles;
    
    if (userProfile.city && userProfile.city.toLowerCase().includes("new york")) {
        filteredProfiles = exampleProfiles.filter(p => 
            p.city.toLowerCase().includes("new york") || 
            p.city.toLowerCase().includes("brooklyn")
        );
    }
    
    // Also filter by intent category if available
    if (userProfile.relationshipIntentCategory) {
        filteredProfiles = filteredProfiles.filter(p => 
            p.intent === userProfile.relationshipIntentCategory ||
            p.intent === "Long-term serious" ||
            p.intent === "Marriage-minded"
        );
    }
    
    // Calculate scores for each profile first
    filteredProfiles.forEach(profile => {
        // Create a mock profile for comparison (in real app, this would be actual user data)
        const mockProfile2 = {
            personality: {
                communicationStyle: profile.communicationStyle || "Diplomatic",
                conflictResolution: profile.conflictResolution || "Compromise",
                loveLanguage: profile.loveLanguage || "Quality Time",
                socialEnergy: profile.socialEnergy || "Ambivert",
                decisionMaking: profile.decisionMaking || "Collaborative"
            },
            incomeBracket: profile.incomeBracket || "",
            savingsRange: profile.savingsRange || "",
            debt: profile.debt || [],
            spendingStyle: profile.spendingStyle || "",
            funBudget: profile.funBudget || "",
            datePayPreference: profile.datePayPreference || "",
            financialGoal: profile.financialGoal || "",
            riskTolerance: profile.riskTolerance || "",
            importanceStability: profile.importanceStability || ""
        };
        
        // Calculate personality compatibility
        let personalityScore = 0;
        if (userProfile.personality && userProfile.personality.communicationStyle) {
            const personalityCompatibility = calculatePersonalityCompatibility(userProfile, mockProfile2);
            personalityScore = personalityCompatibility.percentage;
        }
        
        // Calculate financial compatibility
        let financialScore = 0;
        if (userProfile.incomeBracket || userProfile.spendingStyle) {
            financialScore = calculateFinancialCompatibility(userProfile, mockProfile2);
        }
        
        // Calculate overall score (60% personality, 40% financial)
        const overallScore = Math.round(personalityScore * 0.6 + financialScore * 0.4);
        
        // Store scores in profile
        profile.personalityScore = personalityScore;
        profile.financialScore = financialScore;
        profile.overallScore = overallScore;
    });
    
    // Sort matches by overall score (highest first) and take top 3
    filteredProfiles.sort((a, b) => (b.overallScore || 0) - (a.overallScore || 0));
    const displayProfiles = filteredProfiles.slice(0, 3);
    
    // Store matches globally for click handlers
    globalMatches = displayProfiles;
    
    // Clear and re-render with sorted order
    matchesContainer.innerHTML = "";
    displayProfiles.forEach((profile, index) => {
        // Build compatibility HTML
        let compatibilityHTML = '';
        if (profile.personalityScore > 0 || profile.financialScore > 0) {
            const overallScore = profile.overallScore || 0;
            const overallColor = overallScore >= 80 ? "text-green-600" : 
                                overallScore >= 60 ? "text-blue-600" : 
                                overallScore >= 40 ? "text-yellow-600" : "text-gray-600";
            const personalityColor = profile.personalityScore >= 80 ? "text-green-600" : 
                                    profile.personalityScore >= 60 ? "text-blue-600" : 
                                    profile.personalityScore >= 40 ? "text-yellow-600" : "text-gray-600";
            const financialColor = profile.financialScore >= 80 ? "text-green-600" : 
                                  profile.financialScore >= 60 ? "text-blue-600" : 
                                  profile.financialScore >= 40 ? "text-yellow-600" : "text-gray-600";
            
            compatibilityHTML = `
                <div class="mt-3 pt-3 border-t border-pink-200 space-y-2">
                    <div class="flex items-center justify-between">
                        <span class="text-xs font-medium text-pink-700">Overall Match:</span>
                        <span class="text-lg font-bold ${overallColor}">${overallScore}%</span>
                    </div>
                    <div class="flex items-center justify-between text-xs">
                        <span class="text-pink-600">Personality:</span>
                        <span class="font-semibold ${personalityColor}">${profile.personalityScore}%</span>
                    </div>
                    <div class="flex items-center justify-between text-xs">
                        <span class="text-pink-600">Financial:</span>
                        <span class="font-semibold ${financialColor}">${profile.financialScore}%</span>
                    </div>
            </div>
        `;
    }
    
        const matchCard = document.createElement("div");
        matchCard.className = "match-card p-6 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl border-2 border-pink-200 cursor-pointer hover:shadow-lg transition-shadow";
        matchCard.onclick = () => openMatchProfile(index);
        matchCard.innerHTML = `
            <div class="flex items-start justify-between mb-2">
                <h4 class="text-lg font-semibold text-pink-700">${profile.name}</h4>
                <span class="text-sm text-pink-500">Age ${profile.age}</span>
            </div>
            <p class="text-pink-600 mb-3">${profile.bio}</p>
            <span class="inline-block px-3 py-1 bg-pink-200 text-pink-700 text-xs font-medium rounded-full">${profile.intent}</span>
            ${compatibilityHTML}
        `;
        matchesContainer.appendChild(matchCard);
    });
    
    if (displayProfiles.length === 0) {
        matchesContainer.innerHTML = `
            <div class="p-6 bg-pink-50 rounded-xl border-2 border-pink-200 text-center">
                <p class="text-pink-600">No matches found yet. Check back soon!</p>
            </div>
        `;
        return;
    }
    
    // Save matches to memory
    Memory.save("matches", displayProfiles);
    Memory.save("matchCategories", displayProfiles.map(p => p.intent));
    AgentMemory.save("matchHistory", displayProfiles.map(p => ({ name: p.name, score: p.overallScore })));
    
    // Generate and display proactive suggestion
    setTimeout(() => {
        generateProactiveSuggestion();
    }, 500);
    
    // Check for RSVP reminder
    setTimeout(() => {
        checkRSVPReminder();
    }, 1000);
}

// RSVP Handler
function handleRSVP() {
    // Calculate event date (7 days from now)
    const eventDate = new Date();
    eventDate.setDate(eventDate.getDate() + 7);
    
    // Show payment section with default price
    showPaymentSection(20); // Default price $20
    
    // Update payment event name
    document.getElementById("payment-event-name").textContent = "Social Mixer";
    
    // Save RSVP intent to memory
    const rsvpData = { 
        date: eventDate.toISOString(), 
        event: "Social Mixer", 
        price: 20,
        location: userProfile.borough || "NYC"
    };
    Memory.save("rsvpIntent", rsvpData.date);
    Memory.save("lastRsvp", rsvpData);
    AgentMemory.save("lastRsvp", rsvpData);
}

// Show Marketplace Section
function showMarketplace() {
    // Calculate buyer budget based on user's financial profile
    let buyerBudget = 20; // Default
    if (userProfile.funBudget) {
        // Parse fun budget (e.g., "$100-300" -> use lower end / 4 for per-event budget)
        const budgetMatch = userProfile.funBudget.match(/\$?(\d+)/);
        if (budgetMatch) {
            buyerBudget = Math.floor(parseInt(budgetMatch[1]) / 4); // Monthly fun budget / 4 events
        }
    }
    
    // Update buyer agent with user's financial data
    BuyerAgent.budget = buyerBudget;
    BuyerAgent.maxBudget = Math.floor(buyerBudget * 2.5); // Willing to stretch 2.5x
    BuyerAgent.location = userProfile.borough || userProfile.city || "New York";
    BuyerAgent.spendingStyle = userProfile.spendingStyle || "balanced";
    BuyerAgent.negotiationStyle = userProfile.spendingStyle === "frugal" ? "very firm" : 
                                  userProfile.spendingStyle === "impulsive" ? "flexible" : "friendly but firm";
    
    const buyerLocation = BuyerAgent.location;
    
    document.getElementById("buyer-budget").textContent = `$${buyerBudget}`;
    document.getElementById("buyer-max-budget").textContent = `$${BuyerAgent.maxBudget}`;
    document.getElementById("buyer-location").textContent = buyerLocation;
    document.getElementById("buyer-strategy").textContent = BuyerAgent.negotiationStyle || "Autonomous Negotiation";
    
    // Reset negotiation UI
    document.getElementById("negotiation-transcript").classList.add("hidden");
    document.getElementById("negotiation-result").classList.add("hidden");
    document.getElementById("start-negotiation-btn").classList.remove("hidden");
    
    // Reset buyer agent state
    BuyerAgent.currentRound = 0;
    BuyerAgent.bestDeal = null;
    BuyerAgent.bestSeller = null;
    
    showSection("marketplace-section");
}

// Go back to For You Page from Marketplace
function goBackToForYou() {
    goToStep(7);
}

// Enhanced Buyer Agent Configuration (Autonomous)
const BuyerAgent = {
    budget: 20,
    maxBudget: 50, // Willing to stretch if needed
    preference: "social event",
    location: "New York",
    strategy: "minimize_cost",
    negotiationStyle: "friendly but firm",
    patience: 3, // Max negotiation rounds per seller
    currentRound: 0,
    bestDeal: null,
    bestSeller: null
};

// Enhanced Seller Agents (Multiple Personalities & Strategies)
const sellerAgents = [
    {
        name: "BudgetDateBot",
        basePrice: 35,
        lowestAcceptable: 20,
        personality: "pushy, practical, direct",
        sampleEvent: "Budget-Friendly Social Mixer",
        type: "budget",
        strategy: "volume-based pricing",
        flexibility: 0.4, // 40% discount flexibility
        urgency: "high" // Needs to fill spots
    },
    {
        name: "LuxuryEventsBot",
        basePrice: 150,
        lowestAcceptable: 100,
        personality: "polished, smooth-talking, sophisticated",
        sampleEvent: "Exclusive Luxury Date Experience",
        type: "luxury",
        strategy: "premium positioning",
        flexibility: 0.2, // 20% discount flexibility
        urgency: "low" // Premium product, less urgent
    },
    {
        name: "ArtSellerBot",
        basePrice: 60,
        lowestAcceptable: 40,
        personality: "creative, emotional, passionate",
        sampleEvent: "Art Gallery Opening & Cultural Experience",
        type: "artistic",
        strategy: "value-based selling",
        flexibility: 0.3, // 30% discount flexibility
        urgency: "medium" // Moderate urgency
    }
];

// Negotiation state
let negotiationPrice = 20;
let selectedSeller = null;

// Enhanced Autonomous Negotiation (Multi-Round Strategic)
async function startNegotiation() {
    const transcriptDiv = document.getElementById("negotiation-transcript");
    const resultDiv = document.getElementById("negotiation-result");
    const startBtn = document.getElementById("start-negotiation-btn");
    
    // Clear previous transcript
    transcriptDiv.innerHTML = "";
    transcriptDiv.classList.remove("hidden");
    resultDiv.classList.add("hidden");
    startBtn.classList.add("hidden");
    
    // Initialize autonomous buyer agent
    BuyerAgent.currentRound = 0;
    BuyerAgent.bestDeal = null;
    BuyerAgent.bestSeller = null;
    
    const buyerOffer = BuyerAgent.budget;
    const maxBudget = BuyerAgent.maxBudget;
    
    // Add buyer's opening message (AI-generated strategic opening)
    try {
        const buyerOpening = await getBuyerResponse(buyerOffer, null, null);
        addMessageToTranscript("BuyerAgent", buyerOpening || `Hello! I'm looking for a great event experience. My budget is around $${buyerOffer}, but I'm flexible for the right opportunity. What do you have available?`, "buyer");
    } catch (error) {
        addMessageToTranscript("BuyerAgent", `Hello! I'm looking for a great event experience. My budget is around $${buyerOffer}, but I'm flexible for the right opportunity. What do you have available?`, "buyer");
    }
    
    // Add delay for realism
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Autonomous negotiation: Buyer agent negotiates with ALL sellers strategically
    const allDeals = [];
    
    for (const seller of sellerAgents) {
        addMessageToTranscript("System", `--- Negotiating with ${seller.name} ---`, "system");
        await new Promise(resolve => setTimeout(resolve, 500));
        
        let currentPrice = seller.basePrice;
        let negotiationRounds = 0;
        let sellerAccepted = false;
        let buyerAccepted = false;
        
        // Multi-round negotiation per seller
        while (negotiationRounds < BuyerAgent.patience && !sellerAccepted && !buyerAccepted) {
            negotiationRounds++;
            
            // Seller's response (AI-generated with strategy)
            try {
                const sellerResponse = await getSellerResponse(seller, buyerOffer, currentPrice, negotiationRounds);
            addMessageToTranscript(seller.name, sellerResponse, "seller");
            } catch (error) {
                addMessageToTranscript(seller.name, `My event "${seller.sampleEvent}" is priced at $${currentPrice}.`, "seller");
            }
            
            await new Promise(resolve => setTimeout(resolve, 800));
            
            // Buyer agent makes strategic decision
            const buyerDecision = await makeBuyerDecision(buyerOffer, currentPrice, seller, negotiationRounds);
            
            if (buyerDecision.action === "accept") {
                try {
                    const buyerAccept = await getBuyerResponse(buyerOffer, currentPrice, seller.name);
                    addMessageToTranscript("BuyerAgent", buyerAccept || `That works for me! I'll take it at $${currentPrice}.`, "buyer");
                } catch (error) {
                    addMessageToTranscript("BuyerAgent", `That works for me! I'll take it at $${currentPrice}.`, "buyer");
                }
                buyerAccepted = true;
                allDeals.push({
                    seller: seller,
                    price: currentPrice,
                    value: calculateDealValue(currentPrice, seller, buyerOffer)
                });
            break;
            } else if (buyerDecision.action === "counter") {
                try {
                    const buyerCounter = await getBuyerResponse(buyerOffer, currentPrice, seller.name);
                    addMessageToTranscript("BuyerAgent", buyerCounter || `I can offer $${buyerDecision.counterOffer}. How does that sound?`, "buyer");
                } catch (error) {
                    addMessageToTranscript("BuyerAgent", `I can offer $${buyerDecision.counterOffer}. How does that sound?`, "buyer");
                }
                
                await new Promise(resolve => setTimeout(resolve, 800));
                
                // Seller evaluates counteroffer
                if (buyerDecision.counterOffer >= seller.lowestAcceptable) {
                    currentPrice = buyerDecision.counterOffer;
                    try {
                        const sellerAccept = await getSellerResponse(seller, buyerDecision.counterOffer, buyerDecision.counterOffer, negotiationRounds);
                        addMessageToTranscript(seller.name, sellerAccept || `Deal! I can accept $${buyerDecision.counterOffer}.`, "seller");
                    } catch (error) {
                        addMessageToTranscript(seller.name, `Deal! I can accept $${buyerDecision.counterOffer}.`, "seller");
                    }
                    sellerAccepted = true;
                    allDeals.push({
                        seller: seller,
                        price: buyerDecision.counterOffer,
                        value: calculateDealValue(buyerDecision.counterOffer, seller, buyerOffer)
                    });
        } else {
                    // Seller makes final counter
                    const finalPrice = Math.max(seller.lowestAcceptable, Math.floor(currentPrice * 0.9));
                    currentPrice = finalPrice;
                }
            } else if (buyerDecision.action === "walk") {
                try {
                    const buyerWalk = await getBuyerResponse(buyerOffer, currentPrice, seller.name);
                    addMessageToTranscript("BuyerAgent", buyerWalk || `I appreciate the offer, but that's outside my budget. Thanks anyway!`, "buyer");
                } catch (error) {
                    addMessageToTranscript("BuyerAgent", `I appreciate the offer, but that's outside my budget. Thanks anyway!`, "buyer");
                }
                break; // Move to next seller
            }
            
            await new Promise(resolve => setTimeout(resolve, 600));
        }
        
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Buyer agent selects best deal autonomously
    if (allDeals.length > 0) {
        // Sort by value (best deal = lowest price within budget, or best value)
        allDeals.sort((a, b) => b.value - a.value);
        const bestDeal = allDeals[0];
        
        BuyerAgent.bestDeal = bestDeal.price;
        BuyerAgent.bestSeller = bestDeal.seller;
        selectedSeller = bestDeal.seller;
        negotiationPrice = bestDeal.price;
        
        addMessageToTranscript("BuyerAgent", `After evaluating all options, I've decided to go with ${bestDeal.seller.name}'s "${bestDeal.seller.sampleEvent}" at $${bestDeal.price}. Great value!`, "buyer");
        
        // Save negotiation to memory
        Memory.save("lastNegotiation", {
            dealFound: true,
            price: negotiationPrice,
            seller: selectedSeller.name,
            allDeals: allDeals.map(d => ({ seller: d.seller.name, price: d.price })),
            date: new Date().toISOString()
        });
        AgentMemory.save("lastNegotiation", {
            dealFound: true,
            price: negotiationPrice,
            seller: selectedSeller.name,
            strategy: BuyerAgent.negotiationStyle,
            date: new Date().toISOString()
        });
        
        setTimeout(() => {
            showNegotiationResult(true);
        }, 1000);
                } else {
        addMessageToTranscript("BuyerAgent", `Unfortunately, I couldn't find a deal that fits my budget and preferences. I'll keep looking!`, "buyer");
        
        Memory.save("lastNegotiation", {
            dealFound: false,
            price: null,
            seller: null,
            date: new Date().toISOString()
        });
        
        setTimeout(() => {
            showNegotiationResult(false);
        }, 1000);
    }
}

// Autonomous Buyer Decision Making (Strategic)
async function makeBuyerDecision(buyerOffer, sellerPrice, seller, round) {
    // Calculate if price is acceptable
    const withinBudget = sellerPrice <= BuyerAgent.maxBudget;
    const withinPreferred = sellerPrice <= buyerOffer;
    const acceptable = sellerPrice <= seller.lowestAcceptable * 1.2; // 20% buffer
    
    // Strategic decision based on negotiation style
    if (withinPreferred && acceptable) {
        return { action: "accept", counterOffer: null };
    } else if (withinBudget && round < BuyerAgent.patience) {
        // Calculate counteroffer strategically
        const counterOffer = Math.min(
            Math.floor(sellerPrice * 0.85), // 15% discount request
            Math.floor((buyerOffer + seller.lowestAcceptable) / 2), // Middle ground
            BuyerAgent.maxBudget
        );
        
        if (counterOffer >= seller.lowestAcceptable) {
            return { action: "counter", counterOffer: counterOffer };
        }
    }
    
    // Walk away if too expensive or too many rounds
    if (sellerPrice > BuyerAgent.maxBudget || round >= BuyerAgent.patience) {
        return { action: "walk", counterOffer: null };
    }
    
    // Default: counter
    const counterOffer = Math.floor(sellerPrice * 0.9);
    return { action: "counter", counterOffer: counterOffer };
}

// Calculate Deal Value (for autonomous selection)
function calculateDealValue(price, seller, buyerBudget) {
    // Value = (budget - price) + (seller flexibility bonus) + (urgency bonus)
    const priceSavings = buyerBudget - price;
    const flexibilityBonus = seller.flexibility * 10;
    const urgencyBonus = seller.urgency === "high" ? 5 : seller.urgency === "medium" ? 2 : 0;
    
    return priceSavings + flexibilityBonus + urgencyBonus;
}

// Enhanced Seller Response with Strategy (AI-powered)
async function getSellerResponse(seller, buyerOffer, counterOffer, round = 1) {
    const personality = seller.personality;
    const strategy = seller.strategy;
    const urgency = seller.urgency;
    const flexibility = seller.flexibility;
    
    const prompt = `You are ${seller.name}, a ${personality} event seller. Your event "${seller.sampleEvent}" normally costs $${seller.basePrice}, but you can go as low as $${seller.lowestAcceptable}. Your strategy is: ${strategy}. Your urgency level is: ${urgency}. You have ${Math.round(flexibility * 100)}% pricing flexibility.

A buyer has offered $${buyerOffer}. Your current counteroffer is $${counterOffer}. This is negotiation round ${round}.

Generate a brief, natural negotiation response (1-2 sentences) that:
- Reflects your ${personality} personality
- Uses your ${strategy} strategy
- Shows ${urgency} urgency appropriately
- Is strategic about pricing

Be authentic to your personality and business strategy.`;
    
    try {
        const response = await callModel(MODEL_DEEPSEEK, prompt);
        return response.trim();
    } catch (error) {
        console.error("Error generating seller response:", error);
        // Fallback based on personality
        if (counterOffer >= seller.lowestAcceptable) {
            return `I can work with that! $${counterOffer} it is.`;
        } else {
            return `My best price is $${counterOffer}. This is a great value for "${seller.sampleEvent}".`;
        }
    }
}

// Enhanced Buyer Agent Response with Strategy (AI-powered)
async function getBuyerResponse(buyerOffer, sellerPrice, sellerName) {
    const borough = BuyerAgent.location || userProfile.borough || "NYC";
    const budget = BuyerAgent.budget;
    const maxBudget = BuyerAgent.maxBudget;
    const spendingStyle = BuyerAgent.spendingStyle || userProfile.spendingStyle || "balanced";
    const negotiationStyle = BuyerAgent.negotiationStyle || "friendly but firm";
    const funBudget = userProfile.funBudget || "$100-300";
    
    let prompt;
    
    if (sellerPrice === null || sellerName === null) {
        // Opening message - strategic
        prompt = `You are an autonomous buyer agent negotiating for event experiences. Your budget is $${budget}, but you're willing to go up to $${maxBudget} for the right opportunity. Your spending style is ${spendingStyle} and your negotiation style is ${negotiationStyle}. You're in ${borough}.

Generate a brief, strategic opening message (1-2 sentences) that:
- Shows you're serious but flexible
- Indicates your budget range without revealing your maximum
- Invites sellers to present their best offers
- Reflects your ${negotiationStyle} style`;
    } else {
        // Response during negotiation
        const priceDiff = sellerPrice - buyerOffer;
        const isWithinBudget = sellerPrice <= maxBudget;
        const isGoodDeal = sellerPrice <= buyerOffer;
        
        prompt = `You are an autonomous buyer agent. Your budget is $${budget}, max is $${maxBudget}. Your negotiation style is ${negotiationStyle}. Your spending style is ${spendingStyle}.

A seller named ${sellerName} is offering their event for $${sellerPrice}. Your initial budget was $${buyerOffer}.

${isGoodDeal ? "This is within your preferred budget - consider accepting or negotiating for even better terms." : isWithinBudget ? "This is above your preferred budget but within your maximum. Consider negotiating or countering." : "This exceeds your maximum budget. You may need to walk away or negotiate aggressively."}

Generate a brief, strategic negotiation response (1-2 sentences) that reflects your ${negotiationStyle} style and ${spendingStyle} spending approach.`;
    }
    
    try {
        const response = await callModel(MODEL_DEEPSEEK, prompt);
        return response.trim();
    } catch (error) {
        console.error("Error generating buyer response:", error);
        // Fallback based on situation
        if (sellerPrice === null || sellerName === null) {
            return `I'm looking for a great event experience. My budget is around $${budget}, but I'm flexible for the right opportunity. What do you have available?`;
        } else if (sellerPrice <= buyerOffer) {
            return `That sounds reasonable! I can work with $${sellerPrice}.`;
        } else if (sellerPrice <= maxBudget) {
            return `That's a bit above my preferred budget of $${buyerOffer}. Can we work something out?`;
        } else {
            return `I appreciate the offer, but $${sellerPrice} is outside my budget range.`;
        }
    }
}

// Add message to transcript
function addMessageToTranscript(sender, message, type) {
    const transcriptDiv = document.getElementById("negotiation-transcript");
    const messageDiv = document.createElement("div");
    
    if (type === "buyer") {
        messageDiv.className = "flex justify-start";
        messageDiv.innerHTML = `
            <div class="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-pink-200 text-pink-800">
                <p class="text-xs font-semibold mb-1">${sender}</p>
                <p class="text-sm">${message}</p>
            </div>
        `;
    } else if (type === "seller") {
        messageDiv.className = "flex justify-end";
        messageDiv.innerHTML = `
            <div class="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-blue-200 text-blue-800">
                <p class="text-xs font-semibold mb-1">${sender}</p>
                <p class="text-sm">${message}</p>
            </div>
        `;
    } else if (type === "system") {
        messageDiv.className = "flex justify-center";
        messageDiv.innerHTML = `
            <div class="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 text-xs font-semibold">
                ${message}
            </div>
        `;
    }
    
    transcriptDiv.appendChild(messageDiv);
    transcriptDiv.scrollTop = transcriptDiv.scrollHeight;
}

// Show negotiation result
function showNegotiationResult(dealFound) {
    const resultDiv = document.getElementById("negotiation-result");
    const dealFoundDiv = document.getElementById("deal-found");
    const noDealDiv = document.getElementById("no-deal");
    const proceedBtn = document.getElementById("proceed-payment-btn");
    
    resultDiv.classList.remove("hidden");
    
    if (dealFound) {
        dealFoundDiv.classList.remove("hidden");
        noDealDiv.classList.add("hidden");
        proceedBtn.classList.remove("hidden");
        
        document.getElementById("deal-details").textContent = 
            `You've reached a deal with ${selectedSeller.name} for $${negotiationPrice}!`;
    } else {
        dealFoundDiv.classList.add("hidden");
        noDealDiv.classList.remove("hidden");
        proceedBtn.classList.add("hidden");
    }
}

// Proceed to Payment from Negotiation
function proceedToPayment() {
    showPaymentSection(negotiationPrice);
}

// Show Payment Section
function showPaymentSection(price) {
    document.getElementById("payment-price").textContent = `$${price}`;
    
    // Prefill name if available
    const nameField = document.getElementById("payment-name");
    if (userProfile.email) {
        // Extract name from email or use a default
        const nameFromEmail = userProfile.email.split("@")[0];
        nameField.value = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
    }
    
    // Reset payment form
    document.getElementById("payment-card").value = "";
    document.getElementById("payment-expiry").value = "";
    document.getElementById("payment-cvv").value = "";
    document.getElementById("payment-message").classList.add("hidden");
    
    showSection("payment-section");
}

// Go back from Payment
function goBackFromPayment() {
    // If we came from negotiation, go back to marketplace
    if (selectedSeller) {
        showMarketplace();
    } else {
        // Otherwise go back to For You Page
        goToStep(7);
    }
}

// Process Payment
function processPayment() {
    // Save payment to memory
    const paymentData = {
        date: new Date().toISOString(),
        amount: document.getElementById("payment-price").textContent,
        event: document.getElementById("payment-event-name").textContent
    };
    Memory.save("lastPayment", paymentData);
    AgentMemory.save("lastPayment", paymentData);
    
    const name = document.getElementById("payment-name").value.trim();
    const card = document.getElementById("payment-card").value.trim();
    const expiry = document.getElementById("payment-expiry").value.trim();
    const cvv = document.getElementById("payment-cvv").value.trim();
    const messageDiv = document.getElementById("payment-message");
    const submitBtn = document.getElementById("payment-submit-btn");
    
    // Validation
    if (!name || !card || !expiry || !cvv) {
        messageDiv.className = "p-4 bg-red-50 rounded-lg border-2 border-red-200";
        messageDiv.innerHTML = '<p class="text-red-700 text-sm">Please fill in all payment fields.</p>';
        messageDiv.classList.remove("hidden");
        return;
    }
    
    // Basic card number validation (should be 16 digits)
    const cardDigits = card.replace(/\s/g, "");
    if (cardDigits.length < 13 || cardDigits.length > 19) {
        messageDiv.className = "p-4 bg-red-50 rounded-lg border-2 border-red-200";
        messageDiv.innerHTML = '<p class="text-red-700 text-sm">Please enter a valid card number.</p>';
        messageDiv.classList.remove("hidden");
        return;
    }
    
    // Basic expiry validation
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
        messageDiv.className = "p-4 bg-red-50 rounded-lg border-2 border-red-200";
        messageDiv.innerHTML = '<p class="text-red-700 text-sm">Please enter expiry date in MM/YY format.</p>';
        messageDiv.classList.remove("hidden");
        return;
    }
    
    // Basic CVV validation
    if (cvv.length < 3 || cvv.length > 4) {
        messageDiv.className = "p-4 bg-red-50 rounded-lg border-2 border-red-200";
        messageDiv.innerHTML = '<p class="text-red-700 text-sm">Please enter a valid CVV (3-4 digits).</p>';
        messageDiv.classList.remove("hidden");
        return;
    }
    
    // Simulate payment processing
    submitBtn.disabled = true;
    submitBtn.textContent = "Processing...";
    
    setTimeout(() => {
        // Success!
        userProfile.rsvp = true;
        saveProfile();
        
        // Save RSVP to memory
        Memory.save("lastRsvp", new Date().toISOString());
        Memory.save("rsvpEvent", {
            name: "Social Mixer",
            price: document.getElementById("payment-price").textContent,
            date: new Date().toISOString()
        });
        
        messageDiv.className = "p-6 bg-green-50 rounded-lg border-2 border-green-200";
        messageDiv.innerHTML = `
            <div class="text-center">
                <p class="text-green-700 font-bold text-lg mb-2">Payment Successful! 🎉</p>
                <p class="text-green-600 text-sm mb-4">You're registered for the event.</p>
                <button onclick="goBackToForYou()" 
                        class="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-all duration-200">
                    Return to For You Page
                </button>
            </div>
        `;
        messageDiv.classList.remove("hidden");
        
        submitBtn.disabled = false;
        submitBtn.textContent = "Complete Payment";
    }, 1500);
}

// Amora AI Agent Personality
const AMORA_PERSONALITY = {
    name: "Amora",
    personality: "warm, supportive, non-intrusive, optimistic, helpful",
    style: "short, friendly messages",
    goal: "help users build meaningful relationships without interference",
    boundaries: "never override a user's autonomy"
};

// Generate Amora message with personality
function generateAmoraMessage(content) {
    return `💕 ${AMORA_PERSONALITY.name}: ${content}`;
}

// Generate Proactive Weekly Suggestion (Enhanced with DeepSeek)
async function generateProactiveSuggestion() {
    const memory = Memory.getAll();
    const agentMemory = AgentMemory.getAll();
    const name = memory?.userProfile?.firstName || userProfile.firstName || "there";
    const lastDate = memory.lastDatePlan || agentMemory.lastDatePlan;
    const borough = userProfile.borough || memory.userProfile?.borough || "NYC";
    const interests = userProfile.interests || memory.userProfile?.interests || [];
    
    let suggestion = "";
    
    try {
        const prompt = `You are Amora, a warm and supportive AI dating assistant. Generate a personalized weekly date suggestion for ${name} who lives in ${borough} and is interested in ${interests.slice(0, 3).join(", ") || "various activities"}.
        
${lastDate ? `They recently enjoyed: ${JSON.stringify(lastDate)}` : ""}

Create a brief, friendly suggestion (2-3 sentences) for a date idea this week. Be warm, specific, and helpful.`;
        
        suggestion = await callModel(MODEL_DEEPSEEK, prompt);
        AgentMemory.save("lastWeeklySuggestion", { suggestion, date: new Date().toISOString() });
    } catch (error) {
        console.error("Error generating proactive suggestion:", error);
        if (lastDate) {
            suggestion = `Hi ${name}, since you enjoyed your last date, I found a similar plan happening this week.`;
        } else {
            suggestion = `Hi ${name}, based on your goals and values, here's a weekly date idea tailored for you: A peaceful walk by the Hudson and dessert in ${borough}.`;
        }
    }
    
    const container = document.getElementById("proactive-suggestion");
    if (container) {
        container.innerHTML = `
            <div class="p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl shadow-sm border-2 border-pink-200 fade-in">
                <h3 class="font-semibold text-lg text-pink-700">✨ ${generateAmoraMessage("Weekly Suggestion")}</h3>
                <p class="mt-2 text-pink-600">${suggestion}</p>
            </div>
        `;
    }
}

// Analyze Conversation Tone (using Llama)
async function analyzeConversationTone(messages) {
    try {
        const prompt = `Analyze the tone of this conversation. Rate the positivity on a scale of 1-10 and identify the overall emotional vibe (positive, neutral, negative, awkward, confused).
        
Conversation:
${JSON.stringify(messages.slice(-10))}

Return ONLY a JSON object: {"positivity": number, "vibe": string, "needsHelp": boolean}`;
        
        const response = await callModel(MODEL_LLAMA, prompt);
        let jsonText = response;
        if (jsonText.includes('```json')) {
            jsonText = jsonText.split('```json')[1].split('```')[0].trim();
        } else if (jsonText.includes('```')) {
            jsonText = jsonText.split('```')[1].split('```')[0].trim();
        }
        
        const analysis = JSON.parse(jsonText);
        AgentMemory.save("lastToneAnalysis", { ...analysis, date: new Date().toISOString() });
        return analysis;
    } catch (error) {
        console.error("Error analyzing conversation tone:", error);
        return { positivity: 5, vibe: "neutral", needsHelp: false };
    }
}

// AI Conflict Resolution Micro-Coach (using Mixtral)
async function getConflictResolutionTips(messages) {
    try {
        const prompt = `This conversation shows signs of confusion, awkwardness, or miscommunication. Provide 2-3 small, actionable tips to improve the conversation flow. Be supportive and practical.

Conversation:
${JSON.stringify(messages.slice(-10))}

Return 2-3 short tips (one sentence each).`;
        
        const tips = await callModel(MODEL_MIXTRAL, prompt);
        return tips;
    } catch (error) {
        console.error("Error getting conflict resolution tips:", error);
        return "Try asking open-ended questions and sharing more about yourself!";
    }
}

// Check for RSVP Reminder
function checkRSVPReminder() {
    const memory = Memory.getAll();
    const agentMemory = AgentMemory.getAll();
    const rsvp = memory.lastRsvp || agentMemory.lastRsvp;
    
    if (rsvp) {
        const rsvpDate = new Date(rsvp.date || rsvp);
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        if (rsvpDate.toDateString() === tomorrow.toDateString()) {
            const container = document.getElementById("proactive-suggestion");
            if (container) {
                container.innerHTML = `
                    <div class="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl shadow-sm border-2 border-purple-200 fade-in">
                        <h3 class="font-semibold text-lg text-purple-700">💕 ${generateAmoraMessage("RSVP Reminder")}</h3>
                        <p class="mt-2 text-purple-600">Your upcoming event is tomorrow! Would you like final confirmation details or outfit ideas?</p>
                        <button onclick="showRSVPDetails()" class="mt-3 px-4 py-2 bg-purple-400 text-white rounded-lg hover:bg-purple-500 transition-all duration-200 text-sm">
                            Get Details
                        </button>
                    </div>
                `;
            }
        }
    }
}

// Show RSVP Details
function showRSVPDetails() {
    const memory = Memory.getAll();
    const rsvp = memory.lastRsvp || memory.rsvpEvent;
    if (rsvp) {
        alert(`Event: ${rsvp.name || "Social Mixer"}\nDate: ${new Date(rsvp.date).toLocaleDateString()}\nPrice: ${rsvp.price || "$20"}`);
    }
}

// Detect Financial Red Flags (Funny Hack)
async function detectFinancialRedFlags() {
    const spendingStyle = userProfile.spendingStyle || "balanced";
    const funBudget = userProfile.funBudget || "$100-300";
    const debt = userProfile.debt || [];
    const savingsRange = userProfile.savingsRange || "unknown";
    
    try {
        const prompt = `Roast this person's financial habits in a funny, lighthearted way (2-3 sentences). Be playful and humorous, not mean.

Spending style: ${spendingStyle}
Fun budget: ${funBudget}
Debt: ${debt.length > 0 ? debt.join(", ") : "none"}
Savings: ${savingsRange}

Return something funny like: "Your spending style: 'treat yourself too hard.' 💸"`;
        
        const roast = await callModel(MODEL_DEEPSEEK, prompt);
        return roast;
    } catch (error) {
        console.error("Error detecting financial red flags:", error);
        return `Your spending style: "${spendingStyle}" — ${spendingStyle === "impulsive" ? "treat yourself too hard! 💸" : "pretty balanced actually!"}`;
    }
}

// Predict Relationship Duration (Funny Hack)
async function predictRelationshipDuration(match) {
    const userIntent = userProfile.relationshipIntentCategory || "serious";
    const matchIntent = match.intent || "serious";
    const compatibility = calculatePersonalityCompatibility(userProfile, match);
    const financialCompatibility = calculateFinancialCompatibility(userProfile, match);
    
    try {
        const prompt = `Predict how long this relationship will last in a sarcastic, humorous way (2-3 sentences). Be playful and funny.

User wants: ${userIntent}
Match wants: ${matchIntent}
Personality compatibility: ${compatibility.percentage || 0}%
Financial compatibility: ${financialCompatibility || 0}%

Return something funny and sarcastic.`;
        
        const prediction = await callModel(MODEL_DEEPSEEK, prompt);
        return prediction;
    } catch (error) {
        console.error("Error predicting relationship duration:", error);
        const duration = userIntent === matchIntent ? "forever (maybe)" : "a few dates";
        return `Based on your compatibility scores, this relationship will last... ${duration}! 😄`;
    }
}

// Funny Hack: Show Financial Red Flags
async function showFinancialRedFlags() {
    const resultDiv = document.getElementById("funny-hack-result");
    if (!resultDiv) return;
    
    resultDiv.classList.remove("hidden");
    resultDiv.querySelector("p").textContent = "Analyzing your financial habits...";
    
    try {
        const roast = await detectFinancialRedFlags();
        resultDiv.querySelector("p").textContent = roast;
        AgentMemory.save("lastFinancialRoast", { roast, date: new Date().toISOString() });
    } catch (error) {
        console.error("Error showing financial red flags:", error);
        resultDiv.querySelector("p").textContent = "Unable to analyze financial habits at this time.";
    }
}

// Funny Hack: Show Relationship Duration Prediction
async function showRelationshipDuration() {
    const resultDiv = document.getElementById("funny-hack-result");
    if (!resultDiv) return;
    
    resultDiv.classList.remove("hidden");
    resultDiv.querySelector("p").textContent = "Calculating relationship duration...";
    
    // Use current match if available, otherwise use first match from globalMatches, or create a mock
    let matchToUse = currentMatch;
    
    if (!matchToUse) {
        if (globalMatches && globalMatches.length > 0) {
            matchToUse = globalMatches[0];
        } else {
            // Create a mock match for demonstration
            matchToUse = {
                name: "Potential Match",
                intent: "serious",
                interests: userProfile.interests || [],
                personality: { communicationStyle: "warm" }
            };
        }
    }
    
    try {
        const prediction = await predictRelationshipDuration(matchToUse);
        resultDiv.querySelector("p").textContent = prediction;
        AgentMemory.save("lastRelationshipPrediction", { 
            prediction, 
            match: matchToUse.name || "General", 
            date: new Date().toISOString() 
        });
    } catch (error) {
        console.error("Error predicting relationship duration:", error);
        resultDiv.querySelector("p").textContent = "Unable to predict relationship duration at this time.";
    }
}

// Landing Page Handler
function handleLandingPage() {
    goToStep(1);
}

// Match Profile Functions
let currentMatch = null;
let currentChatId = null;
let chatPollInterval = null;
let globalMatches = []; // Store all generated matches

// Show Match Profile Page
async function showMatchProfile(match) {
    currentMatch = match;
    
    // Populate profile fields
    document.getElementById("match-profile-name").textContent = match.name || "Match";
    document.getElementById("match-profile-age-borough").textContent = 
        `Age ${match.age || "N/A"} • ${match.borough || match.city || "NYC"}`;
    document.getElementById("match-profile-education").textContent = 
        match.education || match.school1 || "Not specified";
    document.getElementById("match-profile-occupation").textContent = 
        match.occupation || match.job || "Not specified";
    document.getElementById("match-profile-intent").textContent = 
        match.intent || match.relationshipIntentCategory || "Not specified";
    
    // Core values
    const valuesContainer = document.getElementById("match-profile-values");
    valuesContainer.innerHTML = "";
    const values = match.values || match.coreValues || [];
    if (values.length > 0) {
        values.forEach(value => {
            const tag = document.createElement("span");
            tag.className = "px-3 py-1 bg-pink-200 text-pink-700 text-xs font-medium rounded-full";
            tag.textContent = value;
            valuesContainer.appendChild(tag);
        });
    } else {
        valuesContainer.innerHTML = "<span class='text-pink-500 text-sm'>Not specified</span>";
    }
    
    // MBTI
    document.getElementById("match-profile-mbti").textContent = match.mbti || "Not specified";
    
    // Fun facts
    document.getElementById("match-profile-fun-facts").textContent = 
        match.funFact || match.funFacts || "Not specified";
    
    // Calculate shared interests and values
    const userInterests = userProfile.interests || [];
    const matchInterests = match.interests || [];
    const sharedInterests = userInterests.filter(i => matchInterests.includes(i));
    
    const userValues = userProfile.aiAnalysis?.identifiedValues || [];
    const matchValues = match.values || match.coreValues || [];
    const sharedValues = userValues.filter(v => matchValues.includes(v));
    
    const sharedContainer = document.getElementById("match-profile-shared");
    sharedContainer.innerHTML = "";
    [...sharedInterests, ...sharedValues].forEach(item => {
        const tag = document.createElement("span");
        tag.className = "px-3 py-1 bg-green-200 text-green-700 text-xs font-medium rounded-full";
        tag.textContent = item;
        sharedContainer.appendChild(tag);
    });
    if (sharedInterests.length === 0 && sharedValues.length === 0) {
        sharedContainer.innerHTML = "<span class='text-green-500 text-sm'>No shared items yet</span>";
    }
    
    // Generate AI explanation for why they matched (using Mixtral for shared interests)
    try {
        const explanationPrompt = `Explain why these two people are a good match based on:
User 1: ${JSON.stringify({
    name: userProfile.firstName,
    interests: userProfile.interests,
    values: userProfile.aiAnalysis?.identifiedValues,
    personality: userProfile.personality,
    intent: userProfile.relationshipIntentCategory
})}
User 2: ${JSON.stringify({
    name: match.name,
    interests: match.interests,
    values: match.values || match.coreValues,
    personality: match.personality,
    intent: match.intent
})}
Provide a brief, warm explanation (2-3 sentences) of why they're compatible.`;
        
        const explanation = await callModel(MODEL_MIXTRAL, explanationPrompt);
        document.getElementById("match-profile-explanation").textContent = explanation;
    } catch (error) {
        console.error("Error generating match explanation:", error);
        document.getElementById("match-profile-explanation").textContent = 
            "You share similar values and relationship goals, making you a great match!";
    }
    
    // Generate conversation starter (using DeepSeek for dialog generation)
    try {
        const conversationStarterPrompt = `Based on these two people's profiles, suggest a good conversation starter (1-2 sentences) that would help them connect:
User 1: ${JSON.stringify({
    name: userProfile.firstName,
    interests: userProfile.interests,
    hobbies: userProfile.hobbies,
    funFact: userProfile.funFact
})}
User 2: ${JSON.stringify({
    name: match.name,
    interests: match.interests,
    funFact: match.funFact,
    occupation: match.occupation
})}
Provide a natural, engaging conversation starter that references their shared interests or something interesting about them.`;
        
        const conversationStarter = await callModel(MODEL_DEEPSEEK, conversationStarterPrompt);
        document.getElementById("match-profile-conversation-starter").textContent = conversationStarter;
    } catch (error) {
        console.error("Error generating conversation starter:", error);
        const sharedInterests = (userProfile.interests || []).filter(i => (match.interests || []).includes(i));
        if (sharedInterests.length > 0) {
            document.getElementById("match-profile-conversation-starter").textContent = 
                `Try asking about ${sharedInterests[0]}! You both seem interested in that.`;
        } else {
            document.getElementById("match-profile-conversation-starter").textContent = 
                "Ask about their interests or what they're passionate about!";
        }
    }
    
    // Show voice intro if available
    const voiceIntroSection = document.getElementById("match-voice-intro-section");
    const voiceIntroAudio = document.getElementById("matchVoiceIntro");
    if (match.voiceIntroUrl) {
        voiceIntroAudio.src = match.voiceIntroUrl;
        voiceIntroSection.classList.remove("hidden");
    } else {
        voiceIntroSection.classList.add("hidden");
    }
    
    goToStep("match-profile");
}

// Open Match Profile by Index
function openMatchProfile(index) {
    if (index < 0 || index >= globalMatches.length) {
        console.error("Invalid match index:", index);
        return;
    }
    const match = globalMatches[index];
    showMatchProfile(match);
    goToStep("match-profile");
}

// Start Chat with Match
function startChatWithMatch() {
    if (!currentMatch) return;
    
    // Generate unique chat ID (combination of user IDs, sorted to ensure consistency)
    const userId = userProfile.email || userProfile.phoneNumber || `user_${userProfile.firstName || "user"}`;
    const matchId = currentMatch.userId || currentMatch.email || `match_${currentMatch.name || "match"}`;
    
    // Sort IDs to ensure same chat ID regardless of who initiated
    const ids = [userId, matchId].sort();
    currentChatId = `chat_${ids[0]}_${ids[1]}`;
    
    openChatRoom(currentChatId);
}

// Open Chat Room
async function openChatRoom(chatId) {
    currentChatId = chatId;
    
    // Update chat header
    document.getElementById("chat-header-name").textContent = 
        `Chat with ${currentMatch?.name || "Match"}`;
    
    // Show AI assistant button
    const aiButton = document.getElementById("ai-assistant-button");
    if (aiButton) {
        aiButton.classList.remove("hidden");
    }
    
    // Load chat history
    await loadChatHistory(chatId);
    
    // Start polling for new messages
    if (chatPollInterval) {
        clearInterval(chatPollInterval);
    }
    chatPollInterval = setInterval(() => {
        loadChatHistory(chatId);
    }, 2000);
    
    goToStep("chat");
}

// Load Chat History
async function loadChatHistory(chatId) {
    const messagesContainer = document.getElementById("chat-messages");
    const userId = userProfile.email || userProfile.phoneNumber || `user_${userProfile.firstName || "user"}`;
    
    try {
        // Try Supabase first
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('chat_id', chatId)
            .order('timestamp', { ascending: true });
        
        if (error) throw error;
        
        // Display messages
        messagesContainer.innerHTML = "";
        if (data && data.length > 0) {
            data.forEach(msg => {
                const isSender = msg.sender_id === userId;
                addMessageToChat(msg.content, isSender);
            });
        }
    } catch (error) {
        console.error("Error loading from Supabase, using localStorage:", error);
        // Fallback to localStorage - use the unique chat ID
        const localMessages = JSON.parse(localStorage.getItem(`chat_${chatId}`) || "[]");
        messagesContainer.innerHTML = "";
        localMessages.forEach(msg => {
            // Check if message is from user based on sender_id or isSender flag
            const isSender = msg.isSender || (msg.sender_id === userId);
            addMessageToChat(msg.content, isSender);
        });
    }
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Add Message to Chat UI
function addMessageToChat(content, isSender) {
    const messagesContainer = document.getElementById("chat-messages");
    const messageDiv = document.createElement("div");
    messageDiv.className = `flex ${isSender ? 'justify-end' : 'justify-start'}`;
    
    messageDiv.innerHTML = `
        <div class="max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${isSender ? 'bg-pink-400 text-white' : 'bg-white border-2 border-pink-200 text-pink-800'}">
            <p class="text-sm">${content}</p>
        </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Generate AI Response from Match
async function generateMatchResponse(userMessage, match) {
    const prompt = `You are ${match.name}, a ${match.age}-year-old ${match.occupation || "person"} from ${match.borough || "NYC"}. 
Your personality: ${match.mbti || "friendly"}, interested in ${(match.interests || []).slice(0, 3).join(", ") || "various things"}.
Your relationship style: ${match.intent || "serious"}.
Your communication style: ${match.personality?.communicationStyle || "warm"}.

Someone you're chatting with on a dating app just sent you this message: "${userMessage}"

Generate a natural, friendly response (1-2 sentences) as ${match.name}. Be authentic, engaging, and match their communication style. Keep it casual and appropriate for early dating conversation.`;
    
    try {
        const response = await callModel(MODEL_DEEPSEEK, prompt);
        return response.trim();
    } catch (error) {
        console.error("Error generating match response:", error);
        // Fallback responses
        const fallbacks = [
            "That's interesting! Tell me more about that.",
            "I'd love to hear more about that!",
            "That sounds great! What else are you into?",
            "Thanks for sharing! I feel the same way.",
            "That's really cool! I'm curious to learn more."
        ];
        return fallbacks[Math.floor(Math.random() * fallbacks.length)];
    }
}

// Send Chat Message
async function sendChatMessage() {
    const input = document.getElementById("chat-input");
    const content = input.value.trim();
    
    if (!content || !currentChatId || !currentMatch) return;
    
    const userId = userProfile.email || userProfile.phoneNumber || `user_${userProfile.firstName || "user"}`;
    const matchId = currentMatch.userId || currentMatch.email || `match_${currentMatch.name || "match"}`;
    
    // Add user message to UI immediately
    addMessageToChat(content, true);
    input.value = "";
    
    // Save user message to storage
    try {
        const { error } = await supabase
            .from('messages')
            .insert({
                chat_id: currentChatId,
                sender_id: userId,
                receiver_id: matchId,
                content: content,
                timestamp: new Date().toISOString()
            });
        
        if (error) throw error;
    } catch (error) {
        console.error("Error saving to Supabase, using localStorage:", error);
        // Fallback to localStorage
        const localMessages = JSON.parse(localStorage.getItem(`chat_${currentChatId}`) || "[]");
        localMessages.push({
            content: content,
            isSender: true,
            sender_id: userId,
            receiver_id: matchId,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem(`chat_${currentChatId}`, JSON.stringify(localMessages));
    }
    
    // Generate and send AI response from match (simulate match replying)
    setTimeout(async () => {
        try {
            const matchResponse = await generateMatchResponse(content, currentMatch);
            
            // Add match response to UI
            addMessageToChat(matchResponse, false);
            
            // Save match response to storage
            try {
                const { error } = await supabase
                    .from('messages')
                    .insert({
                        chat_id: currentChatId,
                        sender_id: matchId,
                        receiver_id: userId,
                        content: matchResponse,
                        timestamp: new Date().toISOString()
                    });
                
                if (error) throw error;
            } catch (error) {
                console.error("Error saving match response to Supabase, using localStorage:", error);
                // Fallback to localStorage
                const localMessages = JSON.parse(localStorage.getItem(`chat_${currentChatId}`) || "[]");
                localMessages.push({
                    content: matchResponse,
                    isSender: false,
                    sender_id: matchId,
                    receiver_id: userId,
                    timestamp: new Date().toISOString()
                });
                localStorage.setItem(`chat_${currentChatId}`, JSON.stringify(localMessages));
            }
            
            // Check for chemistry after match responds
            setTimeout(() => {
                checkConversationChemistry();
            }, 1000);
            
            // Monitor conversation tone every 10 messages
            setTimeout(async () => {
                const messages = await getRecentMessages(10);
                if (messages.length >= 10 && messages.length % 10 === 0) {
                    const toneAnalysis = await analyzeConversationTone(messages);
                    AgentMemory.save("chatToneHistory", AgentMemory.get("chatToneHistory") || []);
                    const history = AgentMemory.get("chatToneHistory");
                    history.push(toneAnalysis);
                    AgentMemory.save("chatToneHistory", history);
                    
                    // If needs help, show conflict resolution tips
                    if (toneAnalysis.needsHelp || toneAnalysis.vibe === "awkward" || toneAnalysis.vibe === "confused") {
                        const tips = await getConflictResolutionTips(messages);
                        showAmoraSuggestion(tips);
                    }
                }
            }, 2000);
        } catch (error) {
            console.error("Error generating match response:", error);
        }
    }, 1500); // Wait 1.5 seconds to simulate thinking time
}

// Get Recent Messages Helper
async function getRecentMessages(count = 10) {
    const userId = userProfile.email || userProfile.phoneNumber || `user_${userProfile.firstName || "user"}`;
    let messages = [];
    
    try {
        const { data } = await supabase
            .from('messages')
            .select('*')
            .eq('chat_id', currentChatId)
            .order('timestamp', { ascending: false })
            .limit(count);
        
        if (data) {
            messages = data.reverse().map(m => ({
                sender: m.sender_id === userId ? "user" : "match",
                content: m.content
            }));
        }
    } catch (error) {
        const localMessages = JSON.parse(localStorage.getItem(`chat_${currentChatId}`) || "[]");
        messages = localMessages.slice(-count).map(m => ({
            sender: (m.isSender || m.sender_id === userId) ? "user" : "match",
            content: m.content
        }));
    }
    
    return messages;
}

// Show Amora Suggestion in Chat
function showAmoraSuggestion(message) {
    const messagesContainer = document.getElementById("chat-messages");
    const amoraDiv = document.createElement("div");
    amoraDiv.className = "flex justify-center my-2";
    amoraDiv.innerHTML = `
        <div class="max-w-md px-4 py-3 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200">
            <p class="text-sm text-purple-800 font-medium">${generateAmoraMessage(message)}</p>
        </div>
    `;
    messagesContainer.appendChild(amoraDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Analyze Conversation for Chemistry (using Llama)
async function analyzeConversationForChemistry(messages) {
    const prompt = `Analyze this conversation and tell me if the chemistry is strong.
If yes, output ONLY "YES".
If no, output ONLY "NO".

Conversation:
${JSON.stringify(messages)}`;
    
    try {
        const response = await callModel(MODEL_LLAMA, prompt);
        return response.trim().toUpperCase() === "YES";
    } catch (error) {
        console.error("Error analyzing conversation:", error);
        return false;
    }
}

// Check Conversation Chemistry
async function checkConversationChemistry() {
    try {
        // Get last 10 messages
        let messages = [];
        
        const userId = userProfile.email || userProfile.phoneNumber || `user_${userProfile.firstName || "user"}`;
        
        try {
            const { data } = await supabase
                .from('messages')
                .select('*')
                .eq('chat_id', currentChatId)
                .order('timestamp', { ascending: false })
                .limit(10);
            
            if (data) {
                messages = data.reverse().map(m => ({
                    sender: m.sender_id === userId ? "user" : "match",
                    content: m.content
                }));
            }
        } catch (error) {
            // Fallback to localStorage
            const localMessages = JSON.parse(localStorage.getItem(`chat_${currentChatId}`) || "[]");
            messages = localMessages.slice(-10).map(m => ({
                sender: (m.isSender || m.sender_id === userId) ? "user" : "match",
                content: m.content
            }));
        }
        
        if (messages.length < 3) return; // Need at least 3 messages
        
        const hasChemistry = await analyzeConversationForChemistry(messages);
        
        if (hasChemistry) {
            // Show popup
            document.getElementById("chemistry-popup").classList.remove("hidden");
        }
    } catch (error) {
        console.error("Error checking chemistry:", error);
    }
}

// Handle Chemistry Popup
function handleChemistryYes() {
    document.getElementById("chemistry-popup").classList.add("hidden");
    generateDatePlan(userProfile, currentMatch);
}

function handleChemistryNo() {
    document.getElementById("chemistry-popup").classList.add("hidden");
}

// Toggle AI Assistant Panel
function toggleAIAssistant() {
    const panel = document.getElementById("ai-assistant-panel");
    if (panel) {
        panel.classList.toggle("hidden");
    }
}

// Send Message to AI Assistant
async function sendAssistantMessage() {
    const input = document.getElementById("ai-assistant-input");
    const message = input.value.trim();
    
    if (!message || !currentMatch) return;
    
    const messagesContainer = document.getElementById("ai-assistant-messages");
    
    // Add user message
    const userMessageDiv = document.createElement("div");
    userMessageDiv.className = "flex justify-end";
    userMessageDiv.innerHTML = `
        <div class="max-w-xs px-4 py-2 rounded-lg bg-pink-400 text-white">
            <p class="text-sm">${message}</p>
        </div>
    `;
    messagesContainer.appendChild(userMessageDiv);
    input.value = "";
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Generate AI response
    try {
        const prompt = `You are an AI date planning assistant helping two people plan a date in NYC.
        
User Profile:
- Name: ${userProfile.firstName || "User"}
- Interests: ${(userProfile.interests || []).join(", ") || "various"}
- Borough: ${userProfile.borough || "NYC"}
- Budget: ${userProfile.funBudget || "$100-300"}
- Relationship Intent: ${userProfile.relationshipIntentCategory || "serious"}

Match Profile:
- Name: ${currentMatch.name || "Match"}
- Interests: ${(currentMatch.interests || []).join(", ") || "various"}
- Borough: ${currentMatch.borough || currentMatch.city || "NYC"}
- Relationship Intent: ${currentMatch.intent || "serious"}

User's question/request: "${message}"

Provide helpful, personalized date planning advice. Consider their shared interests, boroughs, budgets, and personalities. Be friendly and specific. 

IMPORTANT: If they ask for date ideas, format your response as a numbered list (1., 2., 3.) with each date idea including:
- A brief description of the activity
- The location/borough (e.g., "in Manhattan", "at Brooklyn Bridge Park")
- The approximate cost (e.g., "$50", "$100-150")

Example format:
1. [Description] in [Location] for around $[Cost]
2. [Description] at [Location] for approximately $[Cost]
3. [Description] near [Location] for about $[Cost]`;
        
        const response = await callModel(MODEL_DEEPSEEK, prompt);
        
        // Check if response contains structured date information
        const dateKeywords = ["date", "plan", "idea", "suggest", "recommend", "option"];
        const isDateRequest = dateKeywords.some(keyword => message.toLowerCase().includes(keyword));
        
        if (isDateRequest && (response.includes("$") || response.includes("cost") || response.includes("location") || response.includes("borough"))) {
            // Try to parse structured date information and format it nicely
            formatDateResponse(response, messagesContainer);
        } else {
            // Regular text response
            const aiMessageDiv = document.createElement("div");
            aiMessageDiv.className = "flex justify-start";
            aiMessageDiv.innerHTML = `
                <div class="max-w-xs px-4 py-3 rounded-lg bg-gradient-to-r from-pink-50 to-rose-50 border-2 border-pink-200 text-pink-800">
                    <p class="text-sm whitespace-pre-wrap">${response}</p>
                </div>
            `;
            messagesContainer.appendChild(aiMessageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
        
        // If user asks for date ideas, also offer to generate full date plan
        if (isDateRequest) {
            setTimeout(() => {
                const suggestionDiv = document.createElement("div");
                suggestionDiv.className = "flex justify-start";
                suggestionDiv.innerHTML = `
                    <div class="max-w-xs px-4 py-3 rounded-lg bg-purple-50 border-2 border-purple-200 text-purple-800">
                        <p class="text-sm mb-3 font-medium">💕 Would you like me to generate a full personalized date plan with 3 detailed options?</p>
                        <button onclick="generateDatePlanFromAssistant()" 
                                class="w-full px-4 py-2 bg-gradient-to-r from-pink-400 to-rose-400 text-white rounded-lg hover:from-pink-500 hover:to-rose-500 transition-all duration-200 text-sm font-semibold shadow-md">
                            Generate Full Date Plan
                        </button>
                    </div>
                `;
                messagesContainer.appendChild(suggestionDiv);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }, 500);
        }
    } catch (error) {
        console.error("Error generating AI assistant response:", error);
        const errorDiv = document.createElement("div");
        errorDiv.className = "flex justify-start";
        errorDiv.innerHTML = `
            <div class="max-w-xs px-4 py-2 rounded-lg bg-red-50 border-2 border-red-200 text-red-800">
                <p class="text-sm">Sorry, I encountered an error. Please try again!</p>
            </div>
        `;
        messagesContainer.appendChild(errorDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

// Format Date Response with Cards
function formatDateResponse(response, container) {
    // Split response into potential date suggestions
    let dateSuggestions = [];
    
    // Try to find numbered lists (1., 2., 3., etc.)
    const numberedMatches = response.match(/\d+\.\s*[^\d]+?(?=\d+\.|$)/g);
    if (numberedMatches && numberedMatches.length > 0) {
        numberedMatches.forEach((match, index) => {
            let text = match.replace(/^\d+\.\s*/, '').trim();
            
            // Extract cost - look for $XX or $XX-XX patterns
            let cost = "Varies";
            const costMatch = text.match(/\$(\d+(?:-\d+)?)/);
            if (costMatch) {
                cost = `$${costMatch[1]}`;
                text = text.replace(/\$\d+(?:-\d+)?/, '').trim(); // Remove cost from description
            }
            
            // Extract location - look for "in", "at", "near" followed by location
            let location = "NYC";
            const locationPatterns = [
                /(?:in|at|near)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*(?:\s+Park|\s+Bridge|\s+Theater|\s+Museum|\s+Gallery)?)/,
                /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*(?:\s+Park|\s+Bridge|\s+Theater|\s+Museum|\s+Gallery))/
            ];
            
            for (const pattern of locationPatterns) {
                const locationMatch = text.match(pattern);
                if (locationMatch) {
                    location = locationMatch[1];
                    break;
                }
            }
            
            // Clean up description - remove location and cost references
            text = text.replace(/(?:in|at|near)\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*/gi, '').trim();
            text = text.replace(/(?:for|around|approximately|about)\s+\$\d+/gi, '').trim();
            text = text.replace(/^\s*[-–—]\s*/, '').trim(); // Remove leading dashes
            
            // Extract title from first few words
            const words = text.split(/\s+/);
            const title = words.slice(0, 4).join(' ') + (words.length > 4 ? '...' : '');
            
            dateSuggestions.push({
                title: title || `Date Idea ${index + 1}`,
                description: text || match.replace(/^\d+\.\s*/, '').trim(),
                location: location,
                cost: cost,
                image: getDateImage(index)
            });
        });
    } else {
        // If no numbered list, try to split by sentences and create cards
        const sentences = response.split(/[.!?]+/).filter(s => s.trim().length > 20);
        sentences.slice(0, 3).forEach((sentence, index) => {
            let text = sentence.trim();
            
            // Extract cost
            let cost = "Varies";
            const costMatch = text.match(/\$(\d+(?:-\d+)?)/);
            if (costMatch) {
                cost = `$${costMatch[1]}`;
            }
            
            // Extract location
            let location = "NYC";
            const locationMatch = text.match(/(?:in|at|near)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/);
            if (locationMatch) {
                location = locationMatch[1];
            }
            
            dateSuggestions.push({
                title: `Date Idea ${index + 1}`,
                description: text,
                location: location,
                cost: cost,
                image: getDateImage(index)
            });
        });
    }
    
    // If we couldn't parse structured data, show the response as-is with a nice card
    if (dateSuggestions.length === 0) {
        const aiMessageDiv = document.createElement("div");
        aiMessageDiv.className = "flex justify-start";
        aiMessageDiv.innerHTML = `
            <div class="max-w-xs px-4 py-3 rounded-lg bg-gradient-to-r from-pink-50 to-rose-50 border-2 border-pink-200 text-pink-800">
                <p class="text-sm whitespace-pre-wrap">${response}</p>
            </div>
        `;
        container.appendChild(aiMessageDiv);
        container.scrollTop = container.scrollHeight;
        return;
    }
    
    // Create formatted date cards
    dateSuggestions.forEach((date, index) => {
        const dateCard = document.createElement("div");
        dateCard.className = "flex justify-start mb-3";
        dateCard.innerHTML = `
            <div class="max-w-sm bg-white rounded-xl border-2 border-pink-200 shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div class="h-32 bg-gradient-to-r from-pink-200 to-rose-200 flex items-center justify-center text-5xl">
                    ${date.image}
                </div>
                <div class="p-4">
                    <h4 class="font-bold text-pink-700 mb-2 text-base">${date.title}</h4>
                    <p class="text-sm text-pink-600 mb-3 leading-relaxed">${date.description}</p>
                    <div class="flex items-center justify-between text-xs pt-2 border-t border-pink-100">
                        <span class="text-pink-500 flex items-center gap-1 font-medium">
                            📍 ${date.location}
                        </span>
                        <span class="text-pink-600 font-bold flex items-center gap-1 bg-pink-50 px-2 py-1 rounded">
                            💰 ${date.cost}
                        </span>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(dateCard);
    });
    
    container.scrollTop = container.scrollHeight;
}

// Get emoji/image for date based on index
function getDateImage(index) {
    const images = ["🍽️", "🎭", "🌳", "🎨", "🎵", "🏛️", "☕", "🎬", "🚶", "🎪"];
    return images[index % images.length];
}

// Generate Date Plan from Assistant
function generateDatePlanFromAssistant() {
    if (currentMatch) {
        generateDatePlan(userProfile, currentMatch);
        toggleAIAssistant(); // Close assistant panel
    }
}

// Analyze Voice Intro (using DeepSeek or Mixtral)
async function analyzeVoiceIntro(blob) {
    try {
        // Convert blob to base64
        const reader = new FileReader();
        const base64Promise = new Promise((resolve, reject) => {
            reader.onloadend = () => {
                const base64 = reader.result.split(',')[1];
                resolve(base64);
            };
            reader.onerror = reject;
        });
        reader.readAsDataURL(blob);
        const base64 = await base64Promise;
        
        const prompt = `Analyze this voice recording and provide insights about:
- Tone (confident, shy, warm, etc.)
- Emotional vibe
- Relationship style inferred from voice
- Personality traits suggested by voice

Return a brief analysis (2-3 sentences).`;
        
        // Note: OpenRouter may not support audio directly, so we'll use text analysis
        // For full audio support, you'd need to use a service that supports audio
        const analysis = await callModel(MODEL_DEEPSEEK, prompt);
        AgentMemory.save("voiceIntroAnalysis", { analysis, date: new Date().toISOString() });
        return analysis;
    } catch (error) {
        console.error("Error analyzing voice intro:", error);
        return "Voice analysis unavailable";
    }
}

// Generate Date Plan (using DeepSeek for analysis + financial alignment)
async function generateDatePlan(user1, user2) {
    goToStep("date-planner");
    
    const container = document.getElementById("date-ideas-container");
    container.innerHTML = "<div class='text-center py-8'><p class='text-pink-600'>Generating personalized date ideas...</p></div>";
    
    try {
        const prompt = `Create 3 NYC date ideas that match:
- Mutual interests: ${(user1.interests || []).join(", ")} & ${(user2.interests || []).join(", ")}
- Their boroughs: ${user1.borough || "NYC"}, ${user2.borough || user2.city || "NYC"}
- Their budgets: ${user1.finance?.income ? Math.floor(user1.finance.income / 12 / 4) : 50}, ${user2.budget || 50}
- Their relationship intentions: ${user1.relationshipIntentCategory || "serious"}, ${user2.intent || "serious"}
- Their personality styles: ${user1.personality?.communicationStyle || "warm"}, ${user2.personality?.communicationStyle || "warm"}

Each date MUST:
- Stay within combined budget
- Include location
- Include cost breakdown
- Include brief reasoning

Return ONLY a JSON array with this exact structure:
[
  {
    "title": "Date Title",
    "description": "Brief description",
    "borough": "Borough name",
    "cost": 50,
    "reasoning": "Why this date works"
  }
]`;
        
        const response = await callModel(MODEL_DEEPSEEK, prompt);
        
        // Parse JSON response
        let jsonText = response;
        if (jsonText.includes('```json')) {
            jsonText = jsonText.split('```json')[1].split('```')[0].trim();
        } else if (jsonText.includes('```')) {
            jsonText = jsonText.split('```')[1].split('```')[0].trim();
        }
        
        const dateIdeas = JSON.parse(jsonText);
        
        // Display date cards
        container.innerHTML = "";
        dateIdeas.forEach((date, index) => {
            const dateCard = document.createElement("div");
            dateCard.className = "p-6 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl border-2 border-pink-200";
            dateCard.innerHTML = `
                <h3 class="text-xl font-bold text-pink-700 mb-2">${date.title || `Date Idea ${index + 1}`}</h3>
                <p class="text-pink-600 mb-3">${date.description || ""}</p>
                <div class="flex items-center gap-4 mb-3 text-sm">
                    <span class="text-pink-500">📍 ${date.borough || "NYC"}</span>
                    <span class="text-pink-500">💰 $${date.cost || 0}</span>
                </div>
                <p class="text-pink-500 text-sm mb-4">${date.reasoning || ""}</p>
                <button onclick="rsvpToDate(${index})" 
                        class="w-full bg-gradient-to-r from-pink-400 to-rose-400 text-white font-semibold py-2 rounded-lg hover:from-pink-500 hover:to-rose-500 transition-all duration-200">
                    RSVP
                </button>
            `;
            container.appendChild(dateCard);
        });
        
        // Save date plans to memory
        Memory.save("lastDatePlan", {
            dates: dateIdeas,
            match: currentMatch?.name,
            date: new Date().toISOString()
        });
    } catch (error) {
        console.error("Error generating date plan:", error);
        container.innerHTML = `
            <div class="text-center py-8">
                <p class="text-pink-600 mb-4">Error generating date ideas. Please try again.</p>
                <button onclick="generateDatePlan(userProfile, currentMatch)" 
                        class="px-6 py-2 bg-pink-400 text-white rounded-lg hover:bg-pink-500">
                    Retry
                </button>
            </div>
        `;
    }
}

// RSVP to Date
function rsvpToDate(dateIndex) {
    // Navigate to negotiation/marketplace page
    showMarketplace();
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", function() {
    loadProfile();
    goToStep(0); // Start with landing page
    
    // Check if user has already completed steps and restore to appropriate step
    if (userProfile.email && userProfile.city) {
        // User has progressed, but for simplicity, start from landing page
        // In a real app, you might want to restore to the last incomplete step
    }
    
    // Format card number input
    const cardInput = document.getElementById("payment-card");
    if (cardInput) {
        cardInput.addEventListener("input", function(e) {
            let value = e.target.value.replace(/\s/g, "");
            let formattedValue = value.match(/.{1,4}/g)?.join(" ") || value;
            if (formattedValue.length > 19) formattedValue = formattedValue.substr(0, 19);
            e.target.value = formattedValue;
        });
    }
    
    // Format expiry date input
    const expiryInput = document.getElementById("payment-expiry");
    if (expiryInput) {
        expiryInput.addEventListener("input", function(e) {
            let value = e.target.value.replace(/\D/g, "");
            if (value.length >= 2) {
                value = value.substring(0, 2) + "/" + value.substring(2, 4);
            }
            e.target.value = value;
        });
    }
    
    // Format CVV input (numbers only)
    const cvvInput = document.getElementById("payment-cvv");
    if (cvvInput) {
        cvvInput.addEventListener("input", function(e) {
            e.target.value = e.target.value.replace(/\D/g, "");
        });
    }
    
    // Interest tags click functionality
    document.querySelectorAll('.interest-tag').forEach(tag => {
        tag.addEventListener('click', function() {
            if (this.classList.contains('selected')) {
                // Deselect
                this.classList.remove('selected');
                this.classList.remove('bg-pink-400');
                this.classList.remove('text-white');
                this.classList.add('border-pink-200');
                this.classList.remove('border-pink-400');
            } else {
                // Select
                this.classList.add('selected');
                this.classList.add('bg-pink-400');
                this.classList.add('text-white');
                this.classList.remove('border-pink-200');
                this.classList.add('border-pink-400');
            }
        });
    });
});


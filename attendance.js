const { chromium } = require('playwright');
const logger = require('./login');

async function fetchAttendance(portalUrl, mobileNumber) {
    const browser = await chromium.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    try {
        logger.info(`🔍 Fetching attendance for ${mobileNumber} from ${portalUrl}`);

        // Open the login page
        await page.goto(`${portalUrl}/student/attendance`, { timeout: 60000 });

        // Wait for login fields
        await page.waitForSelector('#login_mobilenumber', { timeout: 30000 });
        await page.waitForSelector('input[type="password"]', { timeout: 30000 });

        // Fill in login details
        await page.fill('#login_mobilenumber', mobileNumber);
        await page.fill('input[type="password"]', 'Ngit123$');

        // Click login button
        const loginButton = await page.$('button[type="submit"]');
        if (!loginButton) throw new Error('⚠️ Login button not found.');
        await loginButton.click();

        // Wait for login to complete
        await page.waitForNavigation({ waitUntil: 'networkidle' });

        // Manually go to attendance page
        await page.goto(`http://ngit-netra.teleuniv.in/student/attendance`, { timeout: 60000 });

        logger.info("✅ Manually navigated to attendance page.");

        // Wait until attendance data loads
        await page.waitForSelector('.ant-collapse-item', { timeout: 30000 });

        // ✅ Click the "Overall Attendance" collapsible section (last one)
        const collapseHeaders = await page.$$('.ant-collapse-item .ant-collapse-header');
        if (collapseHeaders.length > 0) {
            const lastSection = collapseHeaders[collapseHeaders.length - 1]; // Get last section
            await lastSection.click();
            await page.waitForTimeout(3000); // Increased wait time
        }

        // ✅ Extract "Overall Attendance" from the progress bar (LAST progress bar)
        const overallAttendance = await page.evaluate(() => {
            let progressBars = document.querySelectorAll('.ant-progress-bg');
            if (progressBars.length === 0) return '0%';

            let lastProgressBar = progressBars[progressBars.length - 1];
            let width = lastProgressBar.style.width || 'N/A';

            return width.includes('%') ? width : 'N/A';
        });

        // ✅ Extract "Today's Attendance"
        const todayAttendance = await page.evaluate(() => {
            let attendanceList = [];
            let icons = document.querySelectorAll('.ant-collapse-content-box > div:first-child svg');

            icons.forEach((svg, index) => {
                if (index >= 7) return;

                let fillColor = svg.getAttribute('fill') || '';

                if (fillColor.toLowerCase() === 'green') {
                    attendanceList.push('✅');
                } else if (fillColor.toLowerCase() === 'currentcolor' || fillColor === '') {
                    attendanceList.push('⚪');
                } else {
                    attendanceList.push('❌');
                }
            });

            return attendanceList.join(' ');
        });

        // ✅ Bunking Calculation
       function calculateBunks(overallAttendance) {
            let attendancePercentage = parseFloat(overallAttendance);
            if (isNaN(attendancePercentage)) return '⚠️ No data available';
        
            if (attendancePercentage < 50) {
                return "🔥 Inka raaku college ki, 2K set chesko!";
            } else if (attendancePercentage < 55) {
                return "⚠️ Condonation 2K ready chesko, university ki break idham!\nIppatiki aina regular vundi chaavu!";
            } else if (attendancePercentage < 60) {
                return "⚠️ Condonation 2K ready chesko, university ki break idham!\nIppatiki aina regular vundi chaavu!";
            } else if (attendancePercentage < 65) {
                return "⚠️ College ki regular undu, endhuk endhuk ivanni bane vunav ga!";
            } else if (attendancePercentage < 70) {
                return "⚠️ Oka 1-2 bunks aithe okay, balance chesko!\nAtu 65 ki thaggodhu, 70+ kavodhu anthe ga!";
            } else if (attendancePercentage < 75) {
                return "⚠️ Akkade undu, 75% kaani iga.\nUrgent ga timepass cheyali anipisthe kottuko oka 2-3!";
            } else if (attendancePercentage < 80) {
                return "📉 Max 3-4 classes bunk cheyochu!\nEm osthav cheppu roju college ki?";
            } else if (attendancePercentage < 85) {
                return "📉 5-6 bunks safe ga kottochu!\nEm vundhi anthaga ee college lo 80% above maintain chesthunav?";
            } else if (attendancePercentage < 90) {
                return "📉 Baga maintain chesthunnav, 7-9 bunks possible!\nEnti ippudu 90% ki try chesthava 🤔?";
            } else {
                return "🤔 Em chedham anukutunav ee percentage tho?";
            }
        }
        

        let bunkingInfo = calculateBunks(overallAttendance);

        await browser.close();

        return `
📊 Attendance Report

📅 Today's Attendance:
${todayAttendance}

📈 Overall Attendance: ${overallAttendance}

${bunkingInfo}
        `.trim();

    } catch (error) {
        logger.error(`❌ Error fetching attendance: ${error.message}`);
        await page.screenshot({ path: 'debug.png', fullPage: true });
        await browser.close();
        throw new Error('⚠️ Could not fetch attendance. The website might have changed.');
    }
}

module.exports = { fetchAttendance };

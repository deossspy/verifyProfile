async function addExtensionBadge() {
    const profileLinkElement = document.querySelector('a.dynamic-overflow-container.text-nav');
    const currentPageUrl = window.location.href;

    if (profileLinkElement) {
        const profileUrl = profileLinkElement.href;

        if (currentPageUrl.startsWith(profileUrl)) {
            const profileNameButton = document.querySelector('div.header-title');

            if (profileNameButton) {
                try {
                    const response = await fetch('https://deossspy.github.io/verifyProfile/update_verified_profiles.txt');
                    const verifiedProfiles = await response.text();
                    const verifiedProfileUrls = verifiedProfiles.split('\n').map(url => url.trim()).filter(url => url);

                    const isUserVerified = verifiedProfileUrls.includes(profileUrl);
                    const badge = document.createElement('span');

                    badge.textContent = isUserVerified ? 'ROSYNC USER' : 'VERIFY';
                    badge.className = 'badge';

                    if (!isUserVerified) {
                        badge.addEventListener('click', function() {
                            startVerificationProcess(badge, profileUrl);
                        });
                    }

                    profileNameButton.parentNode.insertBefore(badge, profileNameButton.nextSibling);
                } catch (error) {
                    console.error('Error fetching or processing verified profiles:', error);
                }
            }
        }
    }
}

async function startVerificationProcess(badgeElement, profileUrl) {
    const userEnteredUrl = prompt('Enter the URL of the profile you want to verify (e.g., https://www.roblox.com/users/1234567890/profile):');

    if (userEnteredUrl) {
        if (userEnteredUrl === profileUrl) {
            try {
                const response = await fetch('https://deossspy.github.io/verifyProfile/update_verified_profiles.txt');
                let verifiedProfiles = await response.text();
                let verifiedProfileUrls = verifiedProfiles.split('\n').map(url => url.trim()).filter(url => url);

                if (!verifiedProfileUrls.includes(profileUrl)) {
                    verifiedProfileUrls.push(profileUrl);
                    verifiedProfiles = verifiedProfileUrls.join('\n');

                    const updateResponse = await fetch('https://deossspy.github.io/verifyProfile/update_verified_profiles.txt', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ profiles: verifiedProfiles })
                    });

                    const data = await updateResponse.json();

                    if (data.success) {
                        badgeElement.textContent = 'ROSYNC USER';
                        badgeElement.style.cursor = 'default';
                        alert('Profile verified successfully!');
                    } else {
                        alert('Verification failed.');
                    }
                } else {
                    alert('This profile is already verified.');
                }
            } catch (error) {
                console.error('Error verifying profile:', error);
                alert('Error during verification.');
            }
        } else {
            alert('The entered URL does not match the current profile URL.');
        }
    }
}

addExtensionBadge();

document.getElementById('findBtn').addEventListener('click', async () => {
    const userId = document.getElementById('userId').value.trim();
    const resultDiv = document.getElementById('result');
    
    if (!userId) {
      resultDiv.innerHTML = 'Please enter a User ID.';
      return;
    }
  
    resultDiv.innerHTML = 'Searching...';
  
    try {
      const userRes = await fetch(`https://users.roblox.com/v1/users/${userId}`);
      if (!userRes.ok) throw new Error('Failed to fetch user');
  
      const userData = await userRes.json();
      const username = userData.name;
  
      const presenceRes = await fetch('https://presence.roblox.com/v1/presence/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userIds: [parseInt(userId)] })
      });
  
      if (!presenceRes.ok) throw new Error('Failed to fetch presence');
  
      const presenceData = await presenceRes.json();
      const presence = presenceData.userPresences[0];
  
      if (presence && presence.userPresenceType === 2) { // 2 = In-game
        const placeId = presence.placeId;
        const gameId = presence.gameId;
        const joinUrl = `roblox://experiences/start?placeId=${placeId}&gameInstanceId=${gameId}`;
  
        resultDiv.innerHTML = `
          <p><strong>${username}</strong> is currently in-game!</p>
          <p>Server ID: <code>${gameId}</code></p>
          <a href="${joinUrl}" style="color: #00ff88;">Join Server (using Roblox Player)</a>
        `;
      } else {
        resultDiv.innerHTML = `<p><strong>${username}</strong> is not in-game.</p>`;
      }
    } catch (err) {
      console.error(err);
      resultDiv.innerHTML = 'Error when fetching data. Please verify the ID.';
    }
  });
  

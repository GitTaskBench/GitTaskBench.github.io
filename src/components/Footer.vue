<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-content">
        <div class="footer-section">
          <div class="footer-logo">
            <i class="fas fa-code-branch"></i>
            <span>GitTaskBench</span>
          </div>
          <p class="footer-description">
            A comprehensive benchmark for evaluating AI code generation capabilities across diverse real-world programming tasks.
          </p>
        </div>
        
        <div class="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><router-link to="/">Home</router-link></li>
            <li><router-link to="/leaderboard">LeaderBoard</router-link></li>
            <li><a href="https://github.com/GitTaskBench" target="_blank">GitHub</a></li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h3>Resources</h3>
          <ul>
            <li><a href="#" target="_blank">Documentation</a></li>
            <li><a href="#" target="_blank">Paper</a></li>
            <li><a href="#" target="_blank">Dataset</a></li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h3>Contact</h3>
          <div class="social-links">
            <a href="https://github.com/GitTaskBench" target="_blank" title="GitHub">
              <i class="fab fa-github"></i>
            </a>
            <a href="#" target="_blank" title="Email">
              <i class="fas fa-envelope"></i>
            </a>
            <a href="#" target="_blank" title="Twitter">
              <i class="fab fa-twitter"></i>
            </a>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom">
        <div class="footer-bottom-content">
          <p>&copy; 2024 GitTaskBench. All rights reserved.</p>
          <p>Built with ❤️ for the AI research community</p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter'
}
</script>

<style scoped>
.footer {
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  margin-top: auto;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  padding: 60px 0 40px;
}

.footer-section h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  color: white;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 16px;
}

.footer-logo i {
  font-size: 28px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.footer-description {
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  margin-bottom: 20px;
}

.footer-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-section ul li {
  margin-bottom: 12px;
}

.footer-section ul li a {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.footer-section ul li a:hover {
  color: white;
  transform: translateX(4px);
}

.social-links {
  display: flex;
  gap: 16px;
}

.social-links a {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: all 0.3s ease;
}

.social-links a:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  transform: translateY(-2px);
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 20px 0;
}

.footer-bottom-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.footer-bottom-content p {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  margin: 0;
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 32px;
    padding: 40px 0 30px;
  }
  
  .footer-bottom-content {
    flex-direction: column;
    text-align: center;
  }
  
  .social-links {
    justify-content: center;
  }
}
</style>

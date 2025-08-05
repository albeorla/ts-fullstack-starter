# Qwen CLI Setup with OpenRouter Horizon Beta

## 🎯 Overview

This guide shows how to configure Qwen CLI to work with OpenRouter's horizon-beta endpoint, providing free access to Qwen models during the testing period.

## ✅ Current Status

**CONFIGURATION COMPLETE** - Qwen CLI is successfully working with OpenRouter horizon-beta!

## 🔧 Configuration

### Environment Variables

The following environment variables are configured:

```bash
export OPENROUTER_API_KEY="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"
export OPENAI_API_KEY="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"
export OPENAI_BASE_URL="https://openrouter.ai/api/v1"
export OPENAI_MODEL="openrouter/horizon-beta"
```

### Quick Setup Script

Use the provided configuration script:

```bash
source ./qwen-openrouter-config.sh
```

## 🚀 Usage

### Basic Usage

```bash
# Interactive mode
qwen -m "openrouter/horizon-beta"

# Single prompt
qwen -m "openrouter/horizon-beta" -p "Your prompt here"

# With file context
qwen -m "openrouter/horizon-beta" -p "Analyze this code" --all-files
```

### Available Models

- **openrouter/horizon-beta** (free during testing) - 256K context
- **qwen/qwen3-30b-a3b-04-28** - 30.5B parameters, 131K context
- **qwen/qwen3-14b** - 14.8B parameters, 40K context
- **qwen/qwen3-4b** - 4B parameters, 128K context
- **qwen/qwen3-0.6b-04-28** - 0.6B parameters, 32K context

## 🧪 Testing

### API Test

```bash
curl -s https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openrouter/horizon-beta",
    "messages": [{"role": "user", "content": "Hello!"}],
    "max_tokens": 50
  }'
```

### CLI Test

```bash
qwen -m "openrouter/horizon-beta" -p "What model are you?"
```

## 📊 Features

### Horizon Beta Benefits

- **Free during testing period** - No cost for input/output tokens
- **256K context window** - Large context for complex tasks
- **OpenAI-compatible API** - Works with existing tools
- **Community feedback** - Helps improve the model

### Qwen CLI Capabilities

- **Code comprehension and refactoring**
- **Project-aware operations**
- **Testing and verification**
- **Git workflow support**
- **Safe shell usage**
- **Multi-file navigation**
- **New app scaffolding**

## 🔒 Security Notes

- API keys are stored in environment variables
- Horizon Beta logs prompts/completions for feedback
- Use appropriate API key permissions
- Monitor usage through OpenRouter dashboard

## 📚 Resources

- [OpenRouter Horizon Beta](https://openrouter.ai/openrouter/horizon-beta)
- [Qwen Models on OpenRouter](https://openrouter.ai/qwen)
- [Qwen CLI Documentation](https://github.com/QwenLM/Qwen)

## 🛠️ Troubleshooting

### Common Issues

1. **Authentication Error**: Verify API key is correct
2. **Model Not Found**: Check model name spelling
3. **Rate Limiting**: Monitor usage limits
4. **Network Issues**: Check internet connectivity

### Debug Mode

```bash
qwen -m "openrouter/horizon-beta" -p "Test" --debug
```

## 📈 Usage Monitoring

Monitor your usage through the OpenRouter dashboard:
- Token consumption
- Model performance
- Cost tracking (when applicable)
- API response times 
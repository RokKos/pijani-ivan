using UnityEngine;
using UnityEngine.SceneManagement;

public class ChangeScene : MonoBehaviour
{

    [SerializeField] GameObject StartPanel;
    [SerializeField] GameObject CreditsPanel;

    private void Start() {
        if (StartPanel != null) {
            StartPanel.SetActive(true);
        }
        if (StartPanel != null) {
            CreditsPanel.SetActive(false);
        }
    }

    public void changeToScene(string SceneToChangeTo)
    {
        SceneManager.LoadScene(SceneToChangeTo);
    }

    public void ExitGame() {
        Application.Quit();
    }


    public void ShowCredits(bool enable) {
        StartPanel.SetActive(!enable);
        CreditsPanel.SetActive(enable);
    }
}

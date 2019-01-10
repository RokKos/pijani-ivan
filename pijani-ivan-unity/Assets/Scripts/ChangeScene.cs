using UnityEngine;
using UnityEngine.SceneManagement;

public class ChangeScene : MonoBehaviour
{

    public void changeToScene(int SceneToChangeTo)
    {
        SceneManager.LoadScene(SceneToChangeTo);
    }
   
}
